const forgotPasswordTemplate = ({name,otp})=>{
    return `
    <div>
      <p>Dear, ${name}</p>
    <div>
    ${otp}
    </div>
    <p>
    this otp is valid for only 1 hs</p>
    <br/>
    <p>thanks</p>
</div>

  
    
    `
}
export default forgotPasswordTemplate