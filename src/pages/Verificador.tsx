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
        precio: 19.99,
        imagen: "/placeholder.svg?height=200&width=200",
        cantidad: 50,
        area: "Ropa",
        tipoVenta: "Unidad",
        ubicacion: { x: 30, y: 40 },
        enAlmacen: true,
    },
    "002": {
        nombre: "Pantalón",
        precio: 39.99,
        imagen: "/placeholder.svg?height=200&width=200",
        cantidad: 30,
        area: "Ropa",
        tipoVenta: "Unidad",
        enAlmacen: false,
    },
    "003": {
        nombre: "Zapatos",
        precio: 59.99,
        imagen: "/placeholder.svg?height=200&width=200",
        cantidad: 20,
        area: "Calzado",
        tipoVenta: "Par",
        ubicacion: { x: 50, y: 70 },
        enAlmacen: true,
    },
};

type Producto = {
    nombre: string;
    precio: number;
    imagen: string;
    cantidad: number;
    area: string;
    tipoVenta: string;
    ubicacion?: { x: number; y: number };
    enAlmacen: boolean;
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
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Verificador de Precios Avanzado</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle className="ion-text-center">
                            Verificador de Precios Avanzado
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel position="stacked">Código del Producto</IonLabel>
                            <IonInput
                                value={codigo}
                                placeholder="Ingrese el código del producto"
                                onIonChange={(e) => setCodigo(e.detail.value!)}
                            />
                        </IonItem>
                        <IonButton expand="block" onClick={verificarPrecio}>
                            Verificar Precio
                        </IonButton>
                        {resultado && (
                            <div className="ion-padding">
                                <div className="ion-text-center">
                                    <img
                                        src={resultado.imagen}
                                        alt={resultado.nombre}
                                        style={{ width: 200, height: 200, borderRadius: "8px" }}
                                    />
                                    <h3>{resultado.nombre}</h3>
                                    <p>Precio: ${resultado.precio.toFixed(2)}</p>
                                    <p>Cantidad disponible: {resultado.cantidad}</p>
                                    <p>Área: {resultado.area}</p>
                                    <p>Tipo de venta: {resultado.tipoVenta}</p>
                                    <IonBadge color={resultado.enAlmacen ? "success" : "danger"}>
                                        {resultado.enAlmacen
                                            ? "Disponible en almacén"
                                            : "No disponible en almacén"}
                                    </IonBadge>
                                </div>
                                <div className="ion-margin-top">
                                    <h4>Ubicación en la tienda</h4>
                                    {resultado.ubicacion &&(<svg
                                        width="200"
                                        height="200"
                                        viewBox="0 0 100 100"
                                        className="border"
                                    >
                                        <rect x="0" y="0" width="100" height="100" fill="#f0f0f0" />
                                        <text x="10" y="20" fontSize="4" fill="#333">
                                            Entrada
                                        </text>
                                        <text x="70" y="20" fontSize="4" fill="#333">
                                            Cajas
                                        </text>
                                        <text x="10" y="90" fontSize="4" fill="#333">
                                            Almacén
                                        </text>
                                        <circle
                                            cx={resultado.ubicacion!.x}
                                            cy={resultado.ubicacion!.y}
                                            r="5"
                                            fill="red"
                                        />
                                        <text
                                            x={resultado.ubicacion!.x + 2}
                                            y={resultado.ubicacion!.y - 2}
                                            fontSize="4"
                                            fill="#333"
                                        >
                                            {resultado.nombre}
                                        </text>
                                    </svg>)}
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
