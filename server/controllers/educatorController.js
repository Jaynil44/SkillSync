import express from 'express'

const studentToEdu = async (req, res) => {
    // console.log('request-structure :  => ' , JSON.stringify(req));//controller
    console.log('Auth info:', req.auth);      // or req.user
    console.log('Auth ID:', req.auth?.userId); // if it exists

    res.json({success : true})
}
export default studentToEdu;
