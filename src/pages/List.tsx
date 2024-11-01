import { useState, useRef, useEffect } from "react";
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonInput,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
} from "@ionic/react";
import { useForm, Controller } from "react-hook-form";
import { Barcode, PlusCircle, Trash2 } from "lucide-react";

type FormValues = {
    codigoBarras: string;
    nombre: string;
    numeroArticulo: string;
};

export default function ListaArticulos() {
    const [articulos, setArticulos] = useState<FormValues[]>([]);
    const inputRef = useRef<HTMLIonInputElement | null>(null);
    const { control, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: {
            codigoBarras: "",
            nombre: "",
            numeroArticulo: "",
        },
    });

    const onSubmit = (data: FormValues) => {
        setArticulos((prevArticulos) => [...prevArticulos, data]);
        reset();
        if (inputRef.current) {
            inputRef.current.setFocus();
        }
    };

    const eliminarArticulo = (index: number) => {
        setArticulos((prevArticulos) => prevArticulos.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setFocus();
        }
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <IonCard className="w-full max-w-md shadow-lg rounded-lg bg-white p-6">
                <IonCardHeader className="text-center mb-4">
                    <IonCardTitle className="text-2xl font-semibold">Lista de Artículos</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    {/* Formulario para agregar artículos */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <IonLabel position="stacked" className="text-gray-600 mb-1">Código de Barras</IonLabel>
                            <Controller
                                name="codigoBarras"
                                control={control}
                                render={({ field }) => (
                                    <IonInput
                                        {...field}
                                        ref={inputRef}
                                        placeholder="Escanee o ingrese el código de barras"
                                        onIonChange={(e) => field.onChange(e.detail.value!)}
                                        className="border rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
                                        autocomplete="off"
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <IonLabel position="stacked" className="text-gray-600 mb-1">Nombre del Artículo</IonLabel>
                            <Controller
                                name="nombre"
                                control={control}
                                render={({ field }) => (
                                    <IonInput
                                        {...field}
                                        placeholder="Ingrese el nombre del artículo"
                                        onIonChange={(e) => field.onChange(e.detail.value!)}
                                        className="border rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
                                        autocomplete="on"
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <IonLabel position="stacked" className="text-gray-600 mb-1">Número de Artículo</IonLabel>
                            <Controller
                                name="numeroArticulo"
                                control={control}
                                render={({ field }) => (
                                    <IonInput
                                        {...field}
                                        placeholder="Ingrese el número de artículo"
                                        onIonChange={(e) => field.onChange(e.detail.value!)}
                                        className="border rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
                                        autocomplete="on"
                                    />
                                )}
                            />
                        </div>

                        <IonButton type="submit" expand="block" className=" font-semibold rounded-md py-2 mt-2 flex items-center justify-center">
                            <PlusCircle size={20} className="mr-2" />
                            Agregar Artículo
                        </IonButton>
                    </form>

                    {/* Listado de artículos */}
                    {articulos.length > 0 && (
                        <IonList className="mt-6">
                            {articulos.map((articulo, index) => (
                                <IonItem
                                    key={index}
                                    className="mb-2 flex justify-between items-center p-3"
                                >
                                    <IonLabel>
                                        <h2 className="font-semibold text-gray-800">{articulo.nombre || "Artículo sin nombre"}</h2>
                                        <p className="text-gray-600">Código de Barras: {articulo.codigoBarras || "N/A"}</p>
                                        <p className="text-gray-600">Número de Artículo: {articulo.numeroArticulo || "N/A"}</p>
                                    </IonLabel>
                                    <button
                                        onClick={() => eliminarArticulo(index)}
                                        className="text-red-500 hover:bg-red-100 rounded-full p-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </IonItem>
                            ))}
                        </IonList>
                    )}
                </IonCardContent>
            </IonCard>
        </div>
    );
}
