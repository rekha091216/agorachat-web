import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { setMyUserInfo, setFetchingStatus } from '../../redux/actions'
import { message } from '../../components/common/alert'
import i18next from "i18next";
import { createHashHistory } from 'history'
const history = createHashHistory()
export const getToken = async(agoraId, password) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    return await fetch(`http://localhost:3000/login?account=${agoraId}&password=${password}`, requestOptions).then(res =>
    Promise.all([res.status, res.json()]));
}
export const signUp = async (agoraId, password) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
       return await fetch(`http://localhost:3000/register?account=${agoraId}&password=${password}`, requestOptions).then(res =>
       Promise.all([res.status, res.json()]));
    }
        

export const loginWithToken = async(agoraId, password) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      return await fetch(`http://localhost:3000/login?account=${agoraId}&password=${password}`, requestOptions)
      .then(res =>
        Promise.all([res.status, res.json()]));
}

export function postData(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        cache: 'no-cache',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
    })
        .then(response => response.json())
}

export const loginWithPassword = (agoraId, password) => {
    let options = {
        user: agoraId,
        pwd: password
    };
    WebIM.conn.open(options).then((res) => {
        const { accessToken } = res
        store.dispatch(setMyUserInfo({ agoraId, password }))
        sessionStorage.setItem('webim_auth', JSON.stringify({ agoraId, password, accessToken }))
    }).catch((err) => {
        store.dispatch(setFetchingStatus(false))
    })
}


export function logout() {
    WebIM.conn.close()
    sessionStorage.removeItem('webim_auth')
    window.document.title = 'Agora chat'
}

export function register (agoraId, password, nickname) {
    let options = {
        // appKey: WebIM.config.appkey,
        // apiUrl: WebIM.config.restServer,
        username: agoraId,
        password: password,
        nickname: nickname ? nickname.trim().toLowerCase() : '',
        success: function(){
            store.dispatch(setFetchingStatus(false))
            store.dispatch(setMyUserInfo({ agoraId, password }))
            sessionStorage.setItem('webim_auth', JSON.stringify({ agoraId, password }))
            history.push('/login')
        },

        error: (err) => {
            store.dispatch(setFetchingStatus(false))
            if (JSON.parse(err.data).error === 'duplicate_unique_property_exists') {
                message.error(i18next.t('UserAlreadyExists'))
            } else if (JSON.parse(err.data).error === 'illegal_argument') {
                if (JSON.parse(err.data).error_description === 'USERNAME_TOO_LONG') {
                    return message.error(i18next.t('UserNameTooLong'))
                }else if(JSON.parse(err.data).error_description === 'password or pin must provided'){
                    return  message.error(i18next.t('InvalidPassword'))
                }
                message.error(i18next.t('InvalidUserName'))
            } else if (JSON.parse(err.data).error === 'unauthorized') {
                message.error(i18next.t('SignUpFailed'))
            } else if (JSON.parse(err.data).error === 'resource_limited') {
                message.error(i18next.t('LimitAccount'))
            }
        }
    }
    WebIM.conn.registerUser(options)
}
