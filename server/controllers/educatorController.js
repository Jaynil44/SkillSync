import express from 'express'

const studentToEdu = async (req, res) => {
    console.log('request-structure :  => ' , req);//controller
    res.json({success : true})
}
export default studentToEdu;
