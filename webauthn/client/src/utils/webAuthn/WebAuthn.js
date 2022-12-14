import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import axios from 'axios';
import Swal from 'sweetalert2'


const getRegisterOptions = async () =>{
    const response = await axios.get(`https://web-authn-demo-api.vercel.app/options/${JSON.parse(window.localStorage.getItem('id'))}`);
    return response.data;
}
const verifyRegisterResponse = async (body) =>{
    const response = await axios.post(`https://web-authn-demo-api.vercel.app/verify-registration-response/${JSON.parse(window.localStorage.getItem('id'))}`, body);
    return response.data;
}
const getAuthenticationOptions = async () =>{
    const response = await axios.get(`https://web-authn-demo-api.vercel.app/authentication-options/${JSON.parse(window.localStorage.getItem('id'))}`);
    return response.data;
}
const verifyAuthenticationResponse = async (body) =>{
    const response = await axios.post(`https://web-authn-demo-api.vercel.app/verify-authentication-response/${JSON.parse(window.localStorage.getItem('id'))}`, body);
    return response.data;
}

export const webAuthn = {
    registerCredential : async () =>{
        try {
            const options = await getRegisterOptions();
            const authenticatorResponse = await startRegistration(options);
            const verified = await verifyRegisterResponse(authenticatorResponse);
            if (verified){
                Swal.fire('Credencial Registrada con Exito', 'Ya puede utilizar este metodo para autenticarse', 'success');
                window.localStorage.setItem('credId', authenticatorResponse.id);
            }
        } catch (error) {
            if (error.name === 'InvalidStateError') {
                Swal.fire('Probablemente este autenticador ya ha sido registrado', 'Por favor, intente con otro autenticador', 'error');
            } else {
                Swal.fire(JSON.stringify(error, null, 2), 'Por favor, intente nuevamente', 'error');
            }
        }
    },
    authenticate : async () =>{
        try {
            const options = await getAuthenticationOptions();
            const authenticatorResponse = await startAuthentication(options);
            const verified = await verifyAuthenticationResponse(authenticatorResponse);
            if (verified){
                Swal.fire('Credenciales correctas', 'VAMOOO MESSSI', 'success');
                return true ;
            }
            return false ;
        } catch (error) {
            Swal.fire('Error al autenticarse', 'Por favor, intente nuevamente', 'error');
            return false ;
        }
    }
}