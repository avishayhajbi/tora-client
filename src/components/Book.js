import React, {Component, useState} from "react";
import {Button, Form,} from 'react-bootstrap';

export const Book = ({address, description, image_url, tel, writer_notes, _id, versesAmount, weight, isManagement}) => {
    return (
        <div className='d-flex flex-row flex-100 justify-content-center align-content-center'>
            {image_url && <div className='flex-20 marginLeft5px'>
                <img style={styles.image} width={150} height='auto' src={`${image_url}`}/>
            </div>}
            <div className='flex-80'>
                <div className='flex-row'>
                    <b>
                        כתובת:&nbsp;
                    </b>
                    <span className='fontWeight300'>{address}</span>
                </div>
                <div className='flex-row'>
                    <b>
                        פרטי התקשרות:&nbsp;
                    </b>
                    <a href='tel:0525675223'>{tel}</a>
                </div>
                <div className='flex-row'>
                    <b>
                        תיאור:&nbsp;
                    </b>
                    <span className='fontWeight300'>{description}</span>
                </div>
                <div className='flex-row'>
                    <b>
                        הקדשה אישית של מפרסם הספר:&nbsp;
                    </b>
                    <span className='fontWeight300'>{writer_notes}</span>
                </div>
                {versesAmount !== undefined && <div className='flex-row'>
                    <b>
                        פסוקים זמינים:&nbsp;
                    </b>
                    <span className='fontWeight300'>{versesAmount}</span>
                </div>}
                {isManagement && <div className='flex-row'>
                    <b>
                        משקל:&nbsp;
                    </b>
                    <span className='fontWeight300'>{weight ?? 0}</span>
                </div>}
            </div>
        </div>
    )
}

const styles = {
    image: {
        borderRadius: '10px',
    }
};
