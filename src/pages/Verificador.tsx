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
    precios: [{
        nombre: string;
        precioTotal: number;
        unidad: string;
    }],
    ofertas: [{
        precioMayoreo: number;
        precioOferta?: number;
    }]
};

type FormValues = {
    barr_code: string;
};

const VerificadorPreciosAvanzado: React.FC = () => {

    const [resultado, setResultado] = useState<Producto[] | []>([]);

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

        fetch(`http://localhost:5185/api/Precios?codigo=${codigo}`, options)
            .then(response => response.json())
            .then(async response => {
                const ofertas = response.ofertas || [];
                const precios = response.precios || [];

                // Mapea precios
                const preciosMapeados = precios.map((precio: any) =>
                ({
                    nombre: precio.descripcion1 || 'Descripción no disponible',
                    precio: precio.precio || 0,
                    unidad: precio.unidad || 'Unidad no disponible',
                    codigo: precio.codigo
                }));

                // Mapea ofertas
                const ofertasMapeadas = ofertas.map((oferta: any) =>
                ({
                    fechaDesde: oferta.fechaDesde,
                    fechaHasta: oferta.fechaHasta,
                    descuento: oferta.precio
                }));

                // Guarda los datos en el estado
                if (preciosMapeados.length || ofertasMapeadas.length) {
                    await setResultado([{
                        precios: preciosMapeados,
                        ofertas: ofertasMapeadas
                    }]);
                } else {
                    setError("No se encontro ningun producto.");
                }



            })
            .catch(err => {
                console.error(err);
                setError("Ocurrió un error al obtener los datos.");
            });
    }

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setError("");
        setResultado([]);

        if (data.barr_code) {
            GetDataCode(data.barr_code);
        } else {
            setError("Producto no encontrado");
        }

        reset();
    };

    const preventKeyboard = () => {
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
                                    onIonFocus={(e) => preventKeyboard()} // Prevenir el enfoque para evitar el teclado
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

            {resultado.map((data: any, key: number) => {
                return (
                    <IonCard key={key} className="ion-card-content ion-padding card-resultado">
                        <IonCardContent className="animacion-salida">
                            <div className="ion-text-center">
                                <span className="product-info-h3">{data.precios[0].nombre}</span>

                                {data.precios.map((dataPrecios: any, key: number) => {
                                    console.log(dataPrecios);

                                    return (
                                        <><p key={key} className={"precio-oferta"}>
                                            Precio regular: ${dataPrecios.precio} {dataPrecios.unidad}
                                        </p>
                                            <p>{dataPrecios.codigo}</p>
                                        </>)
                                })}

                                {data.ofertas.map((dataOferta: any, key: number) =>
                                    <p key={key} className="precio-oferta">
                                        Precio de Oferta:
                                        <span style={{ fontWeight: "800", fontSize: "3rem" }}>
                                            ${dataOferta.descuento}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </IonCardContent>
                    </IonCard>)
            }
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
