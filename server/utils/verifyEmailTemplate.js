 export const verifyEmailTemplate = ({name,url})=>{
    return`
    <p>Dear ${name}</p>
     <p>Thanks for registering Eccomerce</p>
     <a href=${url} style="color:white;background :blue;margin-top :10px>
     verify Email
     </a>

    `
}


