import React from "react"

import { type ChangeEvent, useState } from "react";




const CreateEventPage: React.FC = () => {

    const [formData, setFormData] = useState({
        title: '',
        descriptioon: '',
        startDate: '',
        endDate: '',
        price: 0,
        location: '',
        showFull: true
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
    return (<>


    </>)

}
export default CreateEventPage