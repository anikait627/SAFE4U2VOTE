import  React from 'react'; 
import { Form, Col, Button } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';


// setup interface for search
export interface SearchProps {
    defaultAdress?: string
    defaultCity?: string
    defaultCounty?: string
    defaultState?: string
    defaultZipCode?: string
}

export const Home: React.FC<SearchProps> = (props) => {

    // toasts var
    const { addToast } = useToasts();
    
    // init variables for input
    const [address, changeAddress] = React.useState(props.defaultAdress || '');
    const onAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => changeAddress(e.target.value || '');

    const [city, changeCity] = React.useState(props.defaultCity || '');
    const onCityChange = (e: React.ChangeEvent<HTMLInputElement>) => changeCity(e.target.value || '');

    const [state, changeState] = React.useState(props.defaultState || '');
    const onStateChange = (e: React.ChangeEvent<HTMLInputElement>) => changeState(e.target.value || '');

    const [zipCode, changeZipCode] = React.useState(props.defaultZipCode || '');
    const onZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => changeZipCode(e.target.value|| '');


    // check if form filled  out
    const disableButton = () => {
        if (address === '' || city === '' || state === '' || zipCode === '') {
            return true;
        }
        return false
    }


    // on search     
    const onFormSubmit = async () => {

        try {
            window.location.href = `/results?address=${address}&city=${city}&state=${state}&zipCode=${zipCode}`;
        } catch(e) {
            addToast(`Search Not Successful: ${e}`, {appearance: 'error'});
        }

    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFormSubmit();
    }


    
    return (
        <div className="container" style={{paddingTop:'100px', alignItems:'center'}}>

            <div style={{width:'500px', margin:'auto', position:'relative'}}>

            <a href='/' style={{color: 'black', textDecoration: 'none'}}><h1 style={{textAlign: 'center'}} >SAFE4U2VOTE</h1></a>
            <p style={{textAlign: 'center'}} >Helping you locate the safest and nearest polling location</p>

            {/* form start */}
            <Form onSubmit={onSubmit} >
    
                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Address</Form.Label>
                    <Form.Control placeholder="1234 Main St." value={address} onChange={onAddressChange} />
                </Form.Group>

                <Form.Row>

                    <Form.Group as={Col} controlId="">
                    <Form.Label>City</Form.Label>
                    <Form.Control placeholder="College Station" value={city} onChange={onCityChange} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="">
                    <Form.Label>State</Form.Label>
                    <Form.Control placeholder="Tx"  value={state} onChange={onStateChange} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control placeholder="77840"  value={zipCode} onChange={onZipCodeChange} type='number' />
                    </Form.Group>

                </Form.Row>

                <Button variant="primary" type="submit" style={{float: 'right'}} disabled={disableButton()} > 
                    Search
                </Button>
            </Form>

            </div>
            
        </div>
    );
    
}

