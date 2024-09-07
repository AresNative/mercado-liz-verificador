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

    async function GetDataCode(codigo: any) {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        fetch(`https://us-west-2.aws.data.mongodb-api.com/app/data-cjvkngm/endpoint/get/cb?Codigo=${codigo}`, options)
            .then(response => response.json())
            .then(response => {
                console.log({
                    nombre: response.data.art[0].Descripcion1,
                    precioTotal: response.data.listaPreciosDUnidad[0].Precio,
                    precioOferta: response.data.listaPreciosDUnidad[0].Precio,
                });

                setResultado({
                    nombre: response.data.art[0].Descripcion1,
                    precioTotal: response.data.listaPreciosDUnidad[0].Precio,

                    precioOferta: response.data.listaPreciosDUnidad[0].Precio,
                });
            })
            .catch(err => {
                console.error(err);
                setError("Ocurrió un error al obtener los datos.");
            });
    }


    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setError("");
        setResultado(null);
        console.log(data);

        if (data.barr_code) {
            GetDataCode(data.barr_code)
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
                                        Precio de Oferta: <span style={{ fontWeight: "800", fontSize: "3rem" }}>${resultado.precioOferta.toFixed(2)}</span>
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
