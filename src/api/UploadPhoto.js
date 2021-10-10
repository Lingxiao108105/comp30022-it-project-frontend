import { getCookie, checkUnauthorized } from './Util';
import { styled } from '@mui/material/styles';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Input = styled('input')({
    display: 'none',
  });

function uploadUserPhoto(photo){

    let formdata = new FormData();
    formdata.append("photo",photo);
    const info = {
        method: 'POST',
        headers: {
            'Authorization': getCookie('token'),
        },
        body:formdata
    }

    return new Promise((resolve, reject) => {
        fetch(BASE_URL + `/user/uploadPhoto`, info)
        .then(res => {
            if(checkUnauthorized(res)) {
                return;
            }

            if (res.ok) {
                res.json().then(resBody => {
                    resolve(resBody)
                })
            } else {
                res.json().then(body => {alert(body.msg)})
            }
        })
        .catch(error => {reject(error)})
        
    })
    
}

function uploadContactPhoto(contactId, photo){

    let formdata = new FormData();
    formdata.append("contact_id",contactId);
    formdata.append("photo",photo);
    const info = {
        method: 'POST',
        headers: {
            'Authorization': getCookie('token'),
        },
        body:formdata
    }

    return new Promise((resolve, reject) => {
        fetch(BASE_URL + `/contact/uploadPhoto`, info)
        .then(res => {
            if(checkUnauthorized(res)) {
                return;
            }

            if (res.ok) {
                res.json().then(resBody => {
                    resolve(resBody)
                })
            } else {
                res.json().then(body => {alert(body.msg)})
            }
        })
        .catch(error => {reject(error)})
        
    })
    
}

export {
    Input,
    uploadUserPhoto,
    uploadContactPhoto
}