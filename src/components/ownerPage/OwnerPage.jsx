import { useState, useContext, useEffect } from "react";
import AddNewAppointmensForm from "../addNewAppointmentsForm/AddNewAppointmentsForm";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import OwnerAppointmentsList from "../ownerAppointmentsList/OwnerAppointmentsList";
import OwnerProviderButtonList from "../ownerProviderButtonList/OwnerProviderButtonList";
import './Sidebar.css';
import OwnerSection from "./OwnerSection";
import sidebar from './executiveSidebar.png';

const OwnerPage = () => {

    const [showDateAppointmentForm, setShowDateAppointmentForm] = useState(false);
    const [hypenLastShopApp, setHypenLastShopApp] = useState("");
    const [slashLastShopApp, setSlashLastShopApp] = useState("");
    const [lastAppFlag, setLastAppFlag] = useState(false);
    const [showList, setShowList] = useState(false);
    const [myShopAppointments, setMyShopAppointments] = useState("");
    const [myShopEmployees, setMyShopEmployees] = useState("");
    const [providerAppointments, setProviderAppointments] = useState("");
    const [providerFlag, setProviderFlag] = useState(false);
    const [showProvList, setShowProvList] = useState(false);


    const { token, user, setShopId } = useContext(AuthenticationContext);

    //Guardar el shopId del Owner
    const fetchDataUser = async () => {
        try {
            const response = await fetch(
                `https://localhost:7276/api/Owner/GetOwnerById/${user.id}`,
                {
                    method: "GET",
                    mode: "cors"
                }
            );
            if (!response.ok) {
                throw new Error("Error in obtaining user");
            }
            const data = await response.json();
            setShopId(data.shopId);
        } catch (error) {
            console.error("Error:", error);
        }
    };




    const changeFlag = () => {
        if (lastAppFlag) {
            setLastAppFlag(false)
        } else {
            setLastAppFlag(true)
        }
    };

    const onClickShowDateAppointmentsForm = () => {
        if (!showDateAppointmentForm) {
            setShowDateAppointmentForm(true);
            setShowList(false);
            setShowProvList(false);
        }
    };

    const onClickOcultDateAppointmentsForm = () => {
        if (showDateAppointmentForm) {
            setShowDateAppointmentForm(false);
        }
    };

    const onClickShowList = () => {
        getMyShopAppointments()
        if (!showList) {
            setShowProvList(false);
            setShowList(true);
            setShowDateAppointmentForm(false);
        }
    };

    const onClickOcultList = () => {
        if (showList) {
            setShowList(false);
        }
    };

    const onClickOcultOtherViews = () => {
        onClickOcultDateAppointmentsForm();
        onClickOcultList();
        //setShowProvList(false);
    };

    const setProviderAppArray = (data) => {
        setProviderAppointments(data);
        setShowProvList(true)
    };

    const onClickShowAppByProvider = () => {
        if (!providerFlag) {
            setProviderFlag(true);
        } else {
            setProviderFlag(false);
        }
    };

    const getMyShopLastAppointment = async () => {
        await fetch(`https://localhost:7276/api/Appointment/GetMyLastShopAppointment`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    // Manejo de errores según el código de estado
                    if (response.status === 404) {
                        throw new Error('Not Found (404)');
                    } else if (response.status === 401) {
                        throw new Error('Unauthorized (401)');
                    } else {
                        throw new Error('Error: ' + response.status);
                    }
                }
            })
            .then((data) => {
                // Procesar los datos aquí
                console.log(data)
                console.log(`My shop last appointment: ${data.dateAndHour}`);
                const auxDate1 = data.dateAndHour.split("T")
                setHypenLastShopApp(auxDate1[0])
                const auxDate2 = auxDate1[0].split("-")
                setSlashLastShopApp(`${auxDate2[2]}/${auxDate2[1]}/${auxDate2[0]}`)
            })
            .catch((error) => {
                // Manejo del error aquí
                console.log(error)
            })
    };


    const getMyShopAppointments = async () => { //devuevle nombres de proveedores, clientes, y servicios//

        await fetch(`https://localhost:7276/api/Appointment/GetAllApointmentsOfMyShop`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error("The response has some errors");
                }
            })
            .then((data) => {
                console.log(`My shop appointments: ${data}`);
                setMyShopAppointments(data);
            })
            .catch((error) => console.log(error))
    };

    const getMyShopEmployees = async () => {

        try {
            const response = await fetch(`https://localhost:7276/api/Employee/GetMyShopEmployees/${user.id}`,
                {
                    method: "GET",
                    mode: "cors"
                    // headers: {
                    //     "content-type": "application/json",
                    //     "authorization": `Bearer ${token}`
                    // }
                })
            if (!response.ok) {
                throw new Error("Error in obtaining user");
            }
            const data = await response.json();
            setMyShopEmployees(data);
            console.log(`My shop employees: ${data}`);
        }
        catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        if (user.role == "Owner") {
            if (!myShopEmployees) {
                getMyShopEmployees();
            }
            if (!hypenLastShopApp) {
                getMyShopLastAppointment();
            }
        }
    }, [lastAppFlag]);

    useEffect(() => {
        fetchDataUser();
    }, []);

    return (
        <>
            <div className="d-flex w-100 " style={{ height: "95vh", width: "95%" }}>
                <div className="sidebar">
                    <button
                        onClick={onClickShowList}
                        className="sidebar-button">
                        MOSTRAR TODOS LOS TURNOS
                    </button>
                    <button
                        onClick={onClickShowAppByProvider}
                        className="sidebar-button">
                        MOSTRAR TURNOS POR PROVEEDOR
                    </button>
                    {providerFlag && (
                        <OwnerProviderButtonList
                            me={user}
                            myShopEmployees={myShopEmployees}
                            token={token}
                            setProviderAppArray={setProviderAppArray}
                            ocultOtherviews={onClickOcultOtherViews}
                        />
                    )}
                    <button
                        onClick={onClickShowDateAppointmentsForm}
                        className="sidebar-button"
                    >
                        AGREGAR NUEVOS TURNOS
                    </button>
                    <img
                        className="executiveSidebar"
                        src={sidebar}
                        alt="Logo"
                    />
                </div>
                <div className="bg-light border rounded m-2 py-4 d-flex justify-content-center align-items-center overflow-auto" style={{ height: "87vh", width: "95%" }}>
                    {!showDateAppointmentForm && !showList && !showProvList ? <OwnerSection /> : ""}
                    {showDateAppointmentForm ? <AddNewAppointmensForm
                        hypenLastShopApp={hypenLastShopApp}
                        slashLastShopApp={slashLastShopApp}
                        token={token}
                        changeFlag={changeFlag}
                        onClickOccultForm={onClickOcultDateAppointmentsForm}
                    /> : ""}
                    {showList ? <OwnerAppointmentsList
                        appointmentsArray={myShopAppointments}
                        employeesArray={myShopEmployees}
                    /> : ""}
                    {showProvList ? <OwnerAppointmentsList
                        appointmentsArray={providerAppointments}
                        employeesArray={myShopEmployees}
                    /> : ""}
                </div>
            </div>
        </>
    );
};
export default OwnerPage;