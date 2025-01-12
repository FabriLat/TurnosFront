import { useState, useRef, useEffect, useContext } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Spiner from "../spiner/Spiner";
import useValidateUser from "../hookCustom/useValidateUser";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import '../shopForm/shopForm.css';
import executive from './executive.png';
import logo from './CheTurnosIco.png';

const ServiceForm = () => {
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const priceRef = useRef(null);
    const durationHoursRef = useRef(null);
    const durationMinutesRef = useRef(null);
    const shopIdRef = useRef(null);
    const navegate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [responseMessagge, setResponseMessagge] = useState("")
    const [styleMessagge, setStyleMessagge] = useState("")

    const showModalHandler = () => {
        if (showModal) {
            setShowModal(false)
            setStyleMessagge("")
            setResponseMessagge("")

            !user && navegate("/login");
            if (user) {
                setShowModal(false)
                navegate("/serviceList");
            }
        } else {
            setShowModal(false)
        }
    };

    const { isClient, isOwner } = useValidateUser();
    const { user } = useContext(AuthenticationContext);

    const [newShopId, setShopId] = useState('0');


    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration: {
            hours: "",
            minutes: "",
        },
        shopId: (user?.role === 'Owner' ? user.shopId : 0),
    });

    const [errors, setErrors] = useState({
        name: false,
        description: false,
        price: false,
        duration: false,
        shopId: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDurationChange = (e, field) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            duration: {
                ...prev.duration,
                [name]: value,
            },
        }));
    };

    const registerService = async () => {
        setLoading(true)
        const durationString = `${formData.duration.hours || "00"}:${formData.duration.minutes || "00"}:00`;
        try {
            const response = await fetch("https://localhost:7276/api/Service/Create", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    duration: durationString,
                    shopId: parseInt(formData.shopId, 10),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setLoading(false);
                const errorMessages = Object.values(errorData.errors).flat().join(", ");
                setResponseMessagge(`Errores de validación: ${errorMessages}`);
                setStyleMessagge("text-danger");
                return
            }


            setStyleMessagge("text-success");
            setResponseMessagge("Operación exitosa!");
            setShowModal(true);
            //showModalHandler();
            setLoading(false);
            setFormData({
                name: "",
                description: "",
                price: "",
                duration: { hours: "", minutes: "" },
                shopId: "",
            });



        } catch (error) {

            setStyleMessagge("text-danger")
            setResponseMessagge("Error de Conexion!")
            //showModalHandler()
            setShowModal(true)
            setLoading(false);
        }
    };

    const registerServiceOwner = async () => {
        console.log(formData)
        setLoading(true)
        const durationString = `${formData.duration.hours || "00"}:${formData.duration.minutes || "00"}:00`;
        console.log(durationString)
        try {
            const response = await fetch("https://localhost:7276/api/Service/CreateOwnerService", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    shopId: parseInt(formData.shopId, 10),
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    duration: durationString,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setLoading(false)
                const errorMessages = Object.values(errorData.errors)
                    .flat()
                    .join(", ");
                throw new Error(`Errores de validación: ${errorMessages}`);
            }

            //alert("Servicio registrado exitosamente");
            setStyleMessagge("text-success");
            setResponseMessagge("Operación exitosa!");
            setShowModal(true);
            //setLoading(false);
            setFormData({
                name: "",
                description: "",
                price: "",
                duration: { hours: "", minutes: "" },
                shopId: "",
            });


        } catch (error) {
            //alert(error.message);
            setStyleMessagge("text-danger")
            setResponseMessagge("Error de Conexion!")
            //showModalHandler()
            setShowModal(true)
            //setLoading(false);
        }

    }



    const handleSubmit = (e) => {
        e.preventDefault();

        let formIsValid = true;

        if (!formData.name) {
            setErrors((prev) => ({ ...prev, name: true }));
            formIsValid = false;
        } else {
            setErrors((prev) => ({ ...prev, name: false }));
        }

        if (!formData.description) {
            setErrors((prev) => ({ ...prev, description: true }));
            formIsValid = false;
        } else {
            setErrors((prev) => ({ ...prev, description: false }));
        }

        if (!formData.price || isNaN(formData.price)) {
            setErrors((prev) => ({ ...prev, price: true }));
            formIsValid = false;
        } else {
            setErrors((prev) => ({ ...prev, price: false }));
        }

        if (!formData.duration.hours || !formData.duration.minutes) {
            setErrors((prev) => ({ ...prev, duration: true }));
            formIsValid = false;
        } else {
            setErrors((prev) => ({ ...prev, duration: false }));
        }

        // if (!formData.shopId) {
        //     setErrors((prev) => ({ ...prev, shopId: true }));
        //     formIsValid = false;
        // } else {
        //     setErrors((prev) => ({ ...prev, shopId: false }));
        // }

        if (formIsValid) {
            if (isOwner()) {
                registerServiceOwner()
            }
            else {

                registerService();
            }

        }
    };

    return (
        <>
            {loading ? (
                <Spiner />
            ) : (
                <div className="outer-container-shop-register">
                    <img
                        className="executive"
                        src={executive}
                        alt="Logo"
                    />
                    <div className="registerShop">
                        <h2>Registrar Servicio
                            <img
                                style={{ marginLeft: '5%' }}
                                className="calendar"
                                src={logo}
                                alt="Logo"
                            /></h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nombre del Servicio:</label>
                                <input
                                    ref={nameRef}
                                    type="text"
                                    placeholder="Introduce el nombre del servicio"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={errors.name ? "input-error" : ""}
                                />
                                {errors.name && <div className="alert alert-warning">Completa el campo.</div>}
                            </div>

                            <div className="form-group">
                                <label>Descripción:</label>
                                <input
                                    ref={descriptionRef}
                                    type="text"
                                    placeholder="Introduce la descripción"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={errors.description ? "input-error" : ""}
                                />
                                {errors.description && <div className="alert alert-warning">Completa el campo.</div>}
                            </div>

                            <div className="form-group">
                                <label>Precio:</label>
                                <input
                                    ref={priceRef}
                                    type="number"
                                    placeholder="Introduce el precio"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={errors.price ? "input-error" : ""}
                                />
                                {errors.price && <div className="alert alert-warning">Completa el campo.</div>}
                            </div>

                            <div className="form-group">
                                <label>Duración:</label>
                                <div className="time-picker">
                                    <input
                                        ref={durationHoursRef}
                                        type="number"
                                        placeholder="Horas"
                                        name="hours"
                                        value={formData.duration.hours}
                                        onChange={(e) => handleDurationChange(e, "hours")}
                                        className={errors.duration ? "input-error" : ""}
                                    />
                                    <input
                                        ref={durationMinutesRef}
                                        type="number"
                                        placeholder="Minutos"
                                        name="minutes"
                                        value={formData.duration.minutes}
                                        onChange={(e) => handleDurationChange(e, "minutes")}
                                        className={errors.duration ? "input-error" : ""}
                                    />
                                </div>
                                {errors.duration && <div className="alert alert-warning">Completa el campo.</div>}
                            </div>

                            {/* <div className="form-group">
                    <label>ID de la Tienda:</label>
                    <input
                        ref={shopIdRef}
                        type="number"
                        placeholder="Introduce el ID de la tienda"
                        name="shopId"
                        value={formData.shopId}
                        onChange={handleChange}
                        className={errors.shopId ? "input-error" : ""}
                    />
                    {errors.shopId && <div className="alert alert-warning">Completa el campo.</div>}
                </div> */}

                            <button type="submit" className="register-button">
                                Registrar Servicio
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <Modal show={showModal} onHide={showModalHandler} centered>
                <Modal.Body>
                    <h3 className={styleMessagge}>{responseMessagge}</h3>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={showModalHandler}>
                        CERRAR
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ServiceForm;
