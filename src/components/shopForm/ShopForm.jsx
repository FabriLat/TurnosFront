import { useState, useRef } from "react";
import executive from './executive.png';
import { Form } from "react-bootstrap";
import logo from './CheTurnosIco.png';
import './shopForm.css';
import { useNavigate } from "react-router-dom";
import Spiner from "../spiner/Spiner";

const daysOfWeek = [
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
    { value: 0, label: "Domingo" },
];

const ShopForm = () => {
    const nameRef = useRef(null);
    const addressRef = useRef(null);
    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    const typeRef = useRef(null);
    const appointmentFrequencyRef = useRef(null);
    const timeStartHourRef = useRef(null);
    const timeStartMinRef = useRef(null);
    const timeEndHourRef = useRef(null);
    const timeEndMinRef = useRef(null);
    const navegate = useNavigate();

    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        type: "1",
        imgUrl: "",
        isPremium: false,
        appointmentFrequency: "30", //por defecot son 30 minutos, esto no se usa en el front. 
        timeStart: { hours: "", minutes: "" },
        timeEnd: { hours: "", minutes: "" },
        //startHour: "",
        //startMin: "",
        //endHour: "",
        //endMin: "",
        workDays: [],
    });

    const [errors, setErrors] = useState({
        name: false,
        address: false,
        phone: false,
        email: false,
        //type: false,
        //appointmentFrequency: false,
        timeStart: false,
        timeEnd: false,
        workDays: false,
        imgUrl: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleWorkDaysChange = (day) => {
        setFormData((prev) => {
            const workDays = prev.workDays.includes(day)
                ? prev.workDays.filter((d) => d !== day)
                : [...prev.workDays, day];
            return { ...prev, workDays };
        });
    };

    const handleTimeChange = (e, field) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                [name]: value,
            },
        }));
    };

    const registerShop = async () => {
        setLoading(true)
        try {
            const response = await fetch("https://localhost:7276/api/Shop/Create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    type: parseInt(formData.type, 10),
                    address: formData.address,
                    phone: formData.phone,
                    email: formData.email,
                    isPremium: formData.isPremium,
                    appoimentFrecuence: parseInt(formData.appointmentFrequency, 10),
                    //timeStart: `${formData.timeStart.hours}:${formData.timeStart.minutes}:00`,
                    //timeEnd: `${formData.timeEnd.hours}:${formData.timeEnd.minutes}:00`,
                    startHour: formData.timeStart.hours,
                    startMin: formData.timeStart.minutes,
                    endHour: formData.timeEnd.hours,
                    endMin: formData.timeEnd.minutes,
                    workDays: formData.workDays,
                    imgUrl: formData.imgUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Datos del error:", errorData.errors);
                setLoading(false);
                const errorMessages = Object.values(errorData.errors)
                    .flat()
                    .join(", ");
                throw new Error(`Errores de validación: ${errorMessages}`);
            }

            const data = await response.json();
            console.log("Tienda registrada:", data);
            setLoading(false);
           
            navegate("/OwnerForm");

        } catch (error) {
            console.error("Error al registrar la tienda:", error);
            
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const name = nameRef.current.value;
        const address = addressRef.current.value;
        const phone = phoneRef.current.value;
        const email = emailRef.current.value;
        // const type = typeRef.current.value;
        //const appointmentFrequency = appointmentFrequencyRef.current.value;
        const timeStartHours = timeStartHourRef.current.value;
        const timeStartMinutes = timeStartMinRef.current.value;
        const timeEndHours = timeEndHourRef.current.value;
        const timeEndMinutes = timeEndMinRef.current.value;


        let formIsValid = true;

        if (!name) {
            setErrors((prevErrors) => ({ ...prevErrors, name: true }));
            formIsValid = false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, name: false }));
        }

        if (!address) {
            setErrors((prevErrors) => ({ ...prevErrors, address: true }));
            formIsValid = false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, address: false }));
        }

        if (!phone) {
            setErrors((prevErrors) => ({ ...prevErrors, phone: true }));
            formIsValid = false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, phone: false }));
        }

        if (!email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: true }));
            formIsValid = false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, email: false }));
        }

        // if (!type) {
        //     setErrors((prevErrors) => ({ ...prevErrors, type: true }));
        //     formIsValid = false;
        // } else {
        //     setErrors((prevErrors) => ({ ...prevErrors, type: false }));
        // }

        // if (!appointmentFrequency || isNaN(appointmentFrequency)) {
        //     setErrors((prevErrors) => ({ ...prevErrors, appointmentFrequency: true }));
        //     formIsValid = false;
        // } else {
        //     setErrors((prevErrors) => ({ ...prevErrors, appointmentFrequency: false }));
        // }

        if (!timeStartHours || !timeStartMinutes) {
            setErrors((prevErrors) => ({ ...prevErrors, timeStart: true }));
            formIsValid = false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, timeStart: false }));
        }

        if (!timeEndHours || !timeEndMinutes) {
            setErrors((prevErrors) => ({ ...prevErrors, timeEnd: true }));
            formIsValid = false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, timeEnd: false }));
        }

        if (formData.workDays.length === 0) {
            setErrors((prevErrors) => ({ ...prevErrors, workDays: true }));
            formIsValid = false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, workDays: false }));
        }
        // if (!formData.imgUrl) {
        //     setErrors((prevErrors) => ({ ...prevErrors, imgUrl: true }));
        //     formIsValid = false;
        // } else {
        //     setErrors((prevErrors) => ({ ...prevErrors, imgUrl: false }));
        // }

        if (formIsValid) {
            registerShop();
        }
    };

    return (
        <>{loading ? (
            <Spiner />
        ) : (
            <div className="outer-container-shop-register">
                <img
                    className="executive"
                    src={executive}
                    alt="Logo"
                />
                <div className="registerShop">
                    <h2>Registro Negocio
                        <img
                            style={{ marginLeft: '5%' }}
                            className="calendar"
                            src={logo}
                            alt="Logo"
                        />
                    </h2>
                    <form className="form-register" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre del Negocio:</label>
                            <input
                                ref={nameRef}
                                type="text"
                                placeholder="Introduce el nombre del negocio"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? "input-error" : ""}
                            />
                            {errors.name && (
                                <div className="alert alert-warning">Completa el campo.</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Dirección:</label>
                            <input
                                ref={addressRef}
                                type="text"
                                placeholder="Introduce la dirección"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={errors.address ? "input-error" : ""}
                            />
                            {errors.address && (
                                <div className="alert alert-warning">Completa el campo.</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Teléfono:</label>
                            <input
                                ref={phoneRef}
                                type="text"
                                placeholder="Introduce el teléfono"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={errors.phone ? "input-error" : ""}
                            />
                            {errors.phone && (
                                <div className="alert alert-warning">Completa el campo.</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Correo Electrónico:</label>
                            <input
                                ref={emailRef}
                                type="email"
                                placeholder="Introduce tu correo electrónico"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? "input-error" : ""}
                            />
                            {errors.email && (
                                <div className="alert alert-warning">Completa el campo.</div>
                            )}
                        </div>
                        {/* <div className="form-group">
                            <label>URL de la Imagen:</label>
                            <input
                                type="text"
                                placeholder="Introduce la URL de la imagen"
                                name="imgUrl"
                                value={formData.imgUrl}
                                onChange={handleChange}
                                className={errors.imgUrl ? "input-error" : ""}
                            />
                            {errors.imgUrl && (
                                <div className="alert alert-warning">Completa el campo.</div>
                            )}
                        </div> */}

                        {/* <div className="form-group">
                            <label>Tipo de Negocio:</label>
                            <select
                                ref={typeRef}
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={errors.type ? "input-error" : ""}
                            >
                                <option value="">Selecciona un tipo</option>
                                <option value="0">Tienda</option>
                                <option value="1">Servicio</option>
                            </select>
                            {errors.type && (
                                <div className="alert alert-warning">Completa el campo.</div>
                            )}
                        </div> */}

                        {/* <div className="form-group">
                            <label>Frecuencia de Citas:</label>
                            <input
                                ref={appointmentFrequencyRef}
                                type="number"
                                placeholder="Introduce la frecuencia de citas"
                                name="appointmentFrequency"
                                value={formData.appointmentFrequency}
                                onChange={handleChange}
                                className={errors.appointmentFrequency ? "input-error" : ""}
                            />
                            {errors.appointmentFrequency && (
                                <div className="alert alert-warning">Completa el campo.</div>
                            )}
                        </div> */}

                        <div className="form-group">
                            <label>Hora de Inicio:</label>
                            <div className="time-picker">
                                <input
                                    ref={timeStartHourRef}
                                    type="number"
                                    placeholder="Horas"
                                    name="hours"
                                    value={formData.timeStart.hours}
                                    onChange={(e) => handleTimeChange(e, "timeStart")}
                                    className={errors.timeStart ? "input-error" : ""}
                                />
                                <input
                                    ref={timeStartMinRef}
                                    type="number"
                                    placeholder="Minutos"
                                    name="minutes"
                                    value={formData.timeStart.minutes}
                                    onChange={(e) => handleTimeChange(e, "timeStart")}
                                    className={errors.timeStart ? "input-error" : ""}
                                />
                            </div>
                            {errors.timeStart && (
                                <div className="alert alert-warning">Completa el campo.</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Hora de Fin:</label>
                            <div className="time-picker">
                                <input
                                    ref={timeEndHourRef}
                                    type="number"
                                    placeholder="Horas"
                                    name="hours"
                                    value={formData.timeEnd.hours}
                                    onChange={(e) => handleTimeChange(e, "timeEnd")}
                                    className={errors.timeEnd ? "input-error" : ""}
                                />
                                <input
                                    ref={timeEndMinRef}
                                    type="number"
                                    placeholder="Minutos"
                                    name="minutes"
                                    value={formData.timeEnd.minutes}
                                    onChange={(e) => handleTimeChange(e, "timeEnd")}
                                    className={errors.timeEnd ? "input-error" : ""}
                                />
                            </div>
                            {errors.timeEnd && (
                                <div className="alert alert-warning">Completa el campo.</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Días de Trabajo:</label>
                            {daysOfWeek.map((day) => (
                                <Form.Check
                                    key={day.value}
                                    type="checkbox"
                                    label={day.label}
                                    checked={formData.workDays.includes(day.value)}
                                    onChange={() => handleWorkDaysChange(day.value)}
                                    className={errors.workDays ? "input-error" : ""}
                                />
                            ))}
                            {errors.workDays && (
                                <div className="alert alert-warning">Completa el campo.</div>
                            )}
                        </div>
                        <button type="submit" className="register-button">Registrar Negocio</button>
                    </form>
                </div>
            </div>
        )}
        </>
    );
};

export default ShopForm;
