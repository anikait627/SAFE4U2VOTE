import  React from 'react'; 
import { useLocation } from 'react-router-dom';
import { Form, Col, Button, Card, Row } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import './index.css';
import logo from '../assets/logo.png';

// setup interface for search
export interface SearchProps {
    defaultAdress?: string
    defaultCity?: string
    defaultState?: string
    defaultZipCode?: string
    defaultIndx?: number
}

export const Results: React.FC<SearchProps> = () => {

    const loc = useLocation();

    const queryParams = React.useMemo(() => new URLSearchParams(loc.search), [loc]);

    React.useEffect(() => {
        if (queryParams.get("address") && queryParams.get("city") && queryParams.get("state") && queryParams.get("zipCode")) {
            onFormSubmit();
        }
    }, [queryParams])

    // toasts var
    const { addToast } = useToasts();
    
    // init variables for input
    const [address, changeAddress] = React.useState(queryParams.get('address') || '');
    const onAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => changeAddress(e.target.value || '');
    
    const [city, changeCity] = React.useState(queryParams.get('city') || '');
    const onCityChange = (e: React.ChangeEvent<HTMLInputElement>) => changeCity(e.target.value || '');

    const [state, changeState] = React.useState(queryParams.get('state') || '');
    const onStateChange = (e: React.ChangeEvent<HTMLInputElement>) => changeState(e.target.value || '');

    const [zipCode, changeZipCode] = React.useState(queryParams.get('zipCode') || '');
    const onZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => changeZipCode(e.target.value || '');
    
    // returned location
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, changeData] = React.useState([] as any[]);

    // check if form filled  out
    const disableButton = () => {
        if (address === '' || city === '' || state === '' || zipCode === '') {
            return true;
        }
        return false
    }

    // change data on search
    const _createCards = React.useCallback(() => {
        
        const cards = [];
        // check size of data
        if(data.length === 0) return;
        const tempIndx = (data.length > 10) ? 10 : data.length;

        // iterate for the top 10 cards
        for(let i = 0; i < tempIndx; i++) {
            // search for button
            const search = 'https://www.google.com/maps/search/' + data[i]['address'] + " " + data[i]['city'] + ', ' + data[i]['state'] + ' ' + data[i]['zip'];
            cards.push(
                <div style={{margin: '50px'}}>

                    <Card style={{marginTop: '25px'}} className='zoom'>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Card.Title style={{float: 'left'}}>
                                        {data[i]['name']}
                                    </Card.Title>
                                </Col>
                                <Col>
                                    <Card.Text style={{float: 'right'}}>
                                    DISTANCE: {data[i]['dist']}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Card.Text style={{float: 'left'}}>
                                        {data[i]['address'] + " " + data[i]['city'] + ', ' + data[i]['state'] + ' ' + data[i]['zipCode']}
                                    </Card.Text>
                                </Col>
                                <Col>
                                    <Card.Text style={{float: 'right'}}>
                                        Covid Index: {data[i]['index']}
                                    </Card.Text>
                                </Col>
                            </Row>
                            <a href={search} target='_blank' rel='noreferrer' ><Button variant="primary" style={{width: '100%', marginTop: '20px'}}>Open Google Maps</Button></a>
                        </Card.Body>
                    </Card>

                </div>
            );
        }

        // return list of cards
        return cards
        
    }, [data]);

    // on search     
    const onFormSubmit = async () => {
        
        try {

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const locations = await fetch(`/locations?address=${address}&city=${city}&state=${state}&zipCode=${zipCode}`).then((resp:any) => resp.json());
            console.log(locations)
            addToast("Successful Search", {appearance: 'success'});
            changeData(locations);
            console.log(locations);

        } catch(e) {
            addToast(`Search Not Successful: ${e}`, {appearance: 'error'});
        }

    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFormSubmit();
    }


    
    return (
        <div className="container" style={{paddingTop:'25px', alignItems:'center'}}>

            <a href='/' style={{color: 'black', textDecoration: 'none'}}><h3 style={{textAlign: 'left', paddingLeft: '15px'}} >SAFE4U2VOTE</h3></a>
            <div style={{ textAlign: 'center',margin:'auto', position:'relative', paddingTop: '20px' }}>


            {/* form start */}
            <Form onSubmit={onSubmit} >
            
            <Form.Row>

                    <Col>
                        <Form.Group as={Col} controlId="">
                            {/* <Form.Label>Address</Form.Label> */}
                            <Form.Control placeholder="Address" value={address} onChange={onAddressChange} />
                        </Form.Group>
                    </Col>
                    
                    <Col>
                        <Form.Group as={Col} controlId="">
                            {/* <Form.Label>City</Form.Label> */}
                            <Form.Control placeholder="City" value={city} onChange={onCityChange} />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group as={Col} controlId="">
                            {/* <Form.Label>State</Form.Label> */}
                            <Form.Control placeholder="State"  value={state} onChange={onStateChange} />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group as={Col} controlId="">
                            {/* <Form.Label>Zip</Form.Label> */}
                            <Form.Control placeholder="ZipCode"  value={zipCode} onChange={onZipCodeChange} type='number' />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Button variant="primary"  type="submit" disabled={disableButton()} style={{width: '180px'}}> 
                            Search
                        </Button>
                    </Col>

                </Form.Row>

            </Form>

            {/* form end */}
            {data.length !== 0 ? 
                 _createCards() 
                :
                <div id="logo" className='logo-div' >
                    <img src={logo} alt="Logo" className='rotate'  />
                </div> 
            }
            
            
            </div>
        </div>
    );
    
}

