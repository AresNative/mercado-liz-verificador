import React, { useState } from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonBadge,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
} from "@ionic/react";
import './Verificador.css'
import PageBase from "@/components/templates/page-base";

// Simulación de una base de datos de productos mejorada
const productosSimulados: Record<string, Producto> = {
    "001": {
        nombre: "Camiseta",
        precioTotal: 19,
        precioOferta: 12.05
      
    },
    "002": {
        nombre: "Pantalón",
        precioTotal: 39.99,
        precioOferta: 10
       
    },
    "003": {
        nombre: "Zapatos",
        precioTotal:10.10 ,
        precioOferta: 9.30       
    },
};

type Producto = {
    nombre: string;
    precioTotal: number;
    precioOferta: number;
    //precioMayoreo: number;

    
};

const VerificadorPreciosAvanzado: React.FC = () => {
    const [codigo, setCodigo] = useState<string>("");
    const [resultado, setResultado] = useState<Producto | null>(null);
    const [error, setError] = useState<string>("");

    const verificarPrecio = () => {
        setError("");
        setResultado(null);

        if (codigo in productosSimulados) {
            setResultado(productosSimulados[codigo]);
        } else {
            setError("Producto no encontrado");
        }
    };

    return (
        
<PageBase>
    <></>
</PageBase>









    );
};

export default VerificadorPreciosAvanzado;


