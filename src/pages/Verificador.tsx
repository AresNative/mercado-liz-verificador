import React, { useState } from "react";
import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonText,
} from "@ionic/react";
import './Verificador.css';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import PageBase from "@/components/templates/page-base";

import { Keyboard } from '@capacitor/keyboard';

type Producto = {
    nombre: string;
    precioTotal: number;
    precioOferta?: number;
};

type FormValues = {
    barr_code: string;
};
const VerificadorPreciosAvanzado: React.FC = () => {

    Keyboard.hide();

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
        <PageBase titulo="Verificador">
            <IonCard className="ion-card">
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
                                    onIonFocus={(e) => e.preventDefault()}
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
                <IonCard className="ion-card-content ion-padding card-resultado  ">
                    <IonCardContent className="animacion-salida">
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
                <IonText color="danger" className="error-message ion-card-content card-resultado">
                    {error}
                </IonText>
            )}
        </PageBase>
    );
};

export default VerificadorPreciosAvanzado;


