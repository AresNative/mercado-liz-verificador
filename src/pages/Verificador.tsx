import React, { useState } from "react";
import {
    IonPage,
    IonHeader,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonText,
    IonToolbar,
} from "@ionic/react";
import './Verificador.css';
import { useForm, SubmitHandler, Controller } from "react-hook-form";

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
        precioTotal: 10.10,
    },
};

type Producto = {
    nombre: string;
    precioTotal: number;
    precioOferta?: number;
};

type FormValues = {
    barr_code: string;
};
const VerificadorPreciosAvanzado: React.FC = () => {
    const [resultado, setResultado] = useState<Producto | null>(null);
    const [error, setError] = useState<string>("");

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>({
        mode: "onSubmit"
    });

    async function GetDataCode(params: any) {
        try {
            const response = await fetch("http://localhost:3000/get/cb", {
                method: 'POST',
                headers: {},
                body: JSON.stringify({
                    code: '000250'
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setError("");
        setResultado(null);

        if (data.barr_code in productosSimulados) {
            GetDataCode(data.barr_code)
            //setResultado(productosSimulados[data.barr_code]);
        } else {
            setError("Producto no encontrado");
        }
        reset();
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className="ion-title">Verificador</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" fullscreen>

                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle className="ion-title">Verificador</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle className="ion-text-center">
                            Escanee producto
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="barr_code"
                                control={control}
                                rules={{ required: "Código de barras es requerido" }}
                                render={({ field }) => (
                                    <IonInput
                                        placeholder="Escanee el código del producto"
                                        value={field.value}
                                        onIonInput={(e: any) => field.onChange(e.detail.value)}
                                    />
                                )}
                            />
                            <IonButton expand="block" type="submit" color="primary">
                                Verificar Precio
                            </IonButton>
                        </form>
                        {errors.barr_code && <IonText color="danger">{errors.barr_code.message}</IonText>}
                    </IonCardContent>
                </IonCard>

                {resultado && (
                    <IonCard>
                        <IonCardContent className="ion-padding">
                            <div className="ion-text-center">
                                <span className="product-info-h3">{resultado.nombre}</span>
                                <p className={resultado.precioOferta ? "" : "precio-oferta"}>
                                    Precio regular: ${resultado.precioTotal.toFixed(2)}
                                </p>
                                {resultado.precioOferta && (
                                    <p className="precio-oferta">
                                        Precio de Oferta: ${resultado.precioOferta.toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </IonCardContent>
                    </IonCard>
                )}

                {error && (
                    <IonText color="danger" className="ion-padding">
                        {error}
                    </IonText>
                )}
            </IonContent>
        </IonPage>
    );
};

export default VerificadorPreciosAvanzado;
