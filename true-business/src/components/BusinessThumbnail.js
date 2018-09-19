import React from 'react';
import { Card, CardBody, CardTitle, CardImg, CardText, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import '../css/BusinessThumbnail.css';

const BusinessThumbnail = (props) => {
    
    return (
        <Col sm="4">
            <Card className="note-thumbnail">
                <CardBody>
                    <CardTitle className="note-title heading"> <Link className="note-link" to={`business/${props.business._id}`}><CardImg className ="image" src={props.business.image} /> </Link></CardTitle>
                    <CardText>Business name: {props.business.name}</CardText>
                    <CardText>Stars: {props.business.stars}</CardText>
                    {/* <CardText>{props.business.location}</CardText> */}
                    <CardText>Business type: {props.business.type}</CardText>
                </CardBody>
            </Card>
        </Col>
    )
}
 
export default BusinessThumbnail;