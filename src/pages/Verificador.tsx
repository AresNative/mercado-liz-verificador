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
} from "@ionic/react";
import './Verificador.css'

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
        <IonPage>

            <IonHeader className="ion-card">

                    <IonTitle className="ion-card-title">Verificador  </IonTitle>
               
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardHeader className="ion-card-content">
                        <IonCardTitle className="ion-text-center">
                            Escanee producto
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent >
                       
                            <IonInput 
                                value={codigo}
                                placeholder="Escanee el código del producto"
                                onIonChange={(e) => setCodigo(e.detail.value!)}
                            />
                     
                        <IonButton expand="block" color={"primary"} onClick={verificarPrecio}>
                            Verificar Precio
                        </IonButton>
                        {resultado && (
                            <div className="ion-padding">
                                <div className="ion-text-center">
                                   
                                    <span className="product-info-h3">{resultado.nombre}</span>
                                    <p >Precio regular: ${(resultado.precioTotal.toFixed(2))}</p>
                                    <p className="precio-oferta"> Precio Oferta: ${(resultado.precioOferta.toFixed(2))}</p>
                                    
                                    
                                </div>
                               
                            </div>
                        )}
                        {error && (
                            <IonText color="danger" className="ion-padding">
                                {error}
                            </IonText>
                        )}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default VerificadorPreciosAvanzado;
