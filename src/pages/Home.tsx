import { useState, useRef, useEffect } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonInput,
  IonIcon,
  IonText,
  IonSpinner,
  IonBadge,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption
} from "@ionic/react";
import { useForm, Controller } from "react-hook-form";
import { pinOutline, barcode, pricetagOutline, search } from "ionicons/icons";


type FormValues = {
  codigoBarras: string;
};

export default function VerificadorPrecio() {
  const [precio, setPrecio] = useState<string>("$0.00");
  const [nombre, setNombre] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [Sucursal, setSucursal] = useState<string>("(Precio 2)");
  const [unidad, setUnidad] = useState();
  const [ofertas, setOfertas] = useState([])

  const inputRef = useRef<HTMLIonInputElement | null>(null);
  const { control, handleSubmit, setFocus, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      codigoBarras: ""
    }
  });
  const loadSucursal = (ev: any) => {
    const value = ev.detail.value;
    setSucursal(value)
  }
  // Obtener datos de la API
  const GetDataCode = async (codigo: string) => {
    setError("");

    try {
      const response = await fetch(`https://api.mercadosliz.com/api/Precios?filtro=${codigo}&Sucursal=${Sucursal}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();

      // Filtrar precios
      const precios = data.precios.map((precio: any) => ({
        nombre: precio.descripcion1 || 'Descripción no disponible',
        precioTotal: precio.precio || 0,
        unidad: precio.unidad
      }));

      // Filtrar ofertas
      const ofertas = data.ofertas.map((oferta: any) => ({
        precioTotal: oferta.precio || 0,
      }));

      // Combinar precios y ofertas
      const resultadosFiltrados = [...precios, ...ofertas];

      if (resultadosFiltrados.length > 0) {
        setPrecio(`$${precios[0].precioTotal.toFixed(2)}`);
        setNombre(`${precios[0].nombre}`);
        setUnidad(precios[0].unidad);
        setOfertas(ofertas)
      } else {
        setError("No se encontraron precios ni ofertas para el código especificado.");
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al obtener los datos.");
    } finally {
      if (inputRef.current) {
        const nativeInput = await inputRef.current.getInputElement();
        nativeInput.focus();
        nativeInput.select();
      }
    }
  };

  const onSubmit = (data: FormValues) => {
    if (data.codigoBarras) {
      GetDataCode(data.codigoBarras);
    } else {
      setError("Por favor, ingrese un código de barras.");
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.getInputElement().then((nativeInput) => {
        nativeInput.focus();
        nativeInput.select();
      });
    }
  }, []);

  return (
    <div className="mx-auto flex items-center bg-gray-100 min-h-screen min-w-screen">
      <IonCard className="w-full max-w-3xl mx-auto mt-4 md:mt-8">
        <IonCardHeader>
          <IonCardTitle className="text-2xl font-bold text-center md:text-3xl">
            Verificador de Precio
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent className="space-y-6">
          {/* Formulario de escáner de código de barras */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="flex items-center gap-2 w-full">
              <IonIcon icon={barcode} className="h-6 w-6 text-gray-500" />
              <span className="font-semibold text-base md:text-lg">Escanear código de barras</span>
              <div className="ml-auto w-40">
                <IonItem>
                  <IonSelect
                    slot="end"
                    aria-label="(Precio 2)"
                    placeholder="Sucursal"
                    multiple={false}
                    onIonChange={loadSucursal}
                    value={Sucursal}
                  >
                    <IonSelectOption value="(Precio 3)">Testeraso</IonSelectOption>
                    <IonSelectOption value="(Precio 2)">Guadalupe</IonSelectOption>
                    <IonSelectOption value="(Precio 4)">Palmas</IonSelectOption>
                    <IonSelectOption value="(Precio Lista)">Mayoreo</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </div>
            </div>

            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0 items-center">
              <Controller
                name="codigoBarras"
                control={control}
                rules={{ required: "El código de barras es obligatorio" }}
                render={({ field }) => (
                  <IonInput
                    {...field}
                    ref={inputRef}
                    placeholder="Ingrese código de barras"
                    onIonChange={(e) => {
                      setValue("codigoBarras", e.detail.value!);
                      field.onChange(e.detail.value!);
                    }}
                    className="border p-2 rounded w-full md:flex-1"
                  />
                )}
              />
              <IonButton type="submit" onClick={() => onSubmit} className="flex items-center justify-center w-full md:w-auto">
                <IonIcon icon={search} className="h-4 w-4 mr-2" />
                Verificar
              </IonButton>
            </div>

            {errors.codigoBarras && (
              <IonText color="danger">{errors.codigoBarras.message}</IonText>
            )}
          </form>

          {/* Resultados de precios y ofertas */}
          <div className="text-center mt-4 py-2">
            <div className="flex flex-col py-2">
              <span className="font-bold text-lg">{nombre}   <IonBadge slot="start">{unidad}</IonBadge></span>
              <span className="text-3xl font-bold md:text-4xl">{precio}</span>
            </div>
          </div>

          {/* Sección de Promociones (estática) */}
          {ofertas && ofertas.length ? (<div className="space-y-2 mt-6">
            <div className="flex items-center space-x-2">
              <IonIcon icon={pricetagOutline} className="h-6 w-6 text-green-500" />
              <span className="font-semibold text-base md:text-lg">Promociones</span>
            </div>
            <div className="border p-2 rounded w-full md:flex-1">
              <IonList className="p-2">
                {ofertas.map((data: any, index) => (
                  <IonItem key={index} className="text-2xl font-bold text-green-600">
                    ${data.precioTotal}
                  </IonItem>
                ))}
              </IonList>
            </div>
          </div>) : (<></>)}

          {/* Mapa y Ubicación (estático) */}
          <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden md:h-64 mt-6">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Mapa de la tienda
            </div>
            <div className="absolute bottom-2 left-2 bg-white p-2 rounded-full shadow">
              <IonIcon icon={pinOutline} className="h-6 w-6 text-red-500" />
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <IonText color="danger" className="error-message ion-card-content">
              {error}
            </IonText>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );
}
