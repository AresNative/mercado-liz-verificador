import React, { useEffect, useState } from "react";
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
import { Capacitor } from "@capacitor/core";

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

    // Obtener datos de mongodb
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
                const data = response.data;
                console.log(response);

                const sucursal = 2;

                const cbItem = data.cb; // Obtener el primer item de 'cb', puedes ajustar si es necesario
                const artItem = data.art && data.art.length > 0 ? data.art[0] : null; // Verificar si hay datos en 'art'
                //const ofertaItem = data.oferta && data.oferta.length > 0 ? data.oferta[0] : null;
                // Filtrar lista de precios según los criterios

                const ofertaItem = data.oferta.filter((item: any) => {
                    const nowUTC = new Date().toISOString();  // Fecha actual en formato UTC ISO

                    return (
                        item.FechaD <= nowUTC &&  // Las fechas ya están en formato UTC
                        item.FechaA >= nowUTC
                    );
                });

                const dataProducto = data.listaPreciosDUnidad.filter((item: any) => {
                    return (
                        item.Lista === `(Precio ${sucursal})` &&  // Filtrar por la lista de precios '(PRECIO 2)'
                        cbItem.Codigo === `${codigo}` &&  // Verificar que el Código CB sea 'P006051' | '008802'
                        cbItem.Unidad === item.Unidad  // Verificar que CB.Unidad coincida con la unidad en listaPreciosDUnidad
                    );
                });

                let precioOferta = [];
                if (ofertaItem.length > 0) precioOferta = data.ofertaD.filter((item: any) => {
                    return (
                        item.ID === ofertaItem[0].ID
                    );
                });

                // Comprobar si hay resultados y usarlos, si no, manejar el caso de "sin coincidencias"
                if (dataProducto.length > 0) {
                    const precioSeleccionado = dataProducto[0].Precio; // Obtener el precio filtrado
                    //const precioOferta = ofertaItem[0].Precio;

                    if (precioOferta.length > 0)
                        setResultado({
                            nombre: artItem ? artItem.Descripcion1 : 'Descripción no disponible', // Descripción del artículo si está disponible
                            precioTotal: precioSeleccionado, // Precio filtrado
                            precioOferta: precioOferta[0].Precio // Oferta (puedes cambiar esto si la lógica es distinta)

                        });
                    else
                        setResultado({
                            nombre: artItem ? artItem.Descripcion1 : 'Descripción no disponible',
                            precioTotal: precioSeleccionado,
                        });
                } else {
                    setError("No se encontraron precios para la lista '(PRECIO 2)' con el Código y Unidad especificados.");
                }

            })
            .catch(err => {
                console.error(err);
                setError("Ocurrió un error al obtener los datos.");
            });


    }

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setError("");
        setResultado(null);

        if (data.barr_code) {
            GetDataCode(data.barr_code);
        } else {
            setError("Producto no encontrado");
        }

        reset();
    };

    const preventKeyboard = (e: any) => {
        if (Capacitor.isNativePlatform()) {
            Keyboard.hide();
        }
    };

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            Keyboard.removeAllListeners();
            Keyboard.hide();
        }
    }, [preventKeyboard])
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
                                    onClick={() => {
                                        if (Capacitor.isNativePlatform()) { Keyboard.hide() }
                                    }}
                                    onIonFocus={(e) => preventKeyboard(e)} // Prevenir el enfoque para evitar el teclado
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
