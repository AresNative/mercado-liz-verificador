import { useEffect, useRef, useState } from 'react';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonToolbar,
} from '@ionic/react';
import { pinOutline, pricetagOutline, search } from 'ionicons/icons';

function Test() {
  const inputRef = useRef<HTMLIonSearchbarElement | null>(null);

  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  const [precio, setPrecio] = useState<string>("$0.00");
  const [nombre, setNombre] = useState<string>("Seleccione un artículo");
  const [unidad, setUnidad] = useState<string | undefined>();
  const [error, setError] = useState<string>("");
  const [sucursal, setSucursal] = useState<string>("(Precio 2)");
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);

  const handleInput = async (event: CustomEvent) => {
    const value = event.detail.value ?? '';
    setQuery(value);
    setPage(1);
    setResults([]);

    if (value) {
      await GetDataCode(value);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (selectedValue: any) => {
    setQuery(selectedValue.nombre);
    setPrecio(`$${selectedValue.precioTotal.toFixed(2)}`);
    setNombre(selectedValue.nombre);
    setUnidad(selectedValue.unidad);
    setResults([]);
  };

  async function loadDate(page: number, codigo: string, sucursal: string) {
    const response = await fetch(
      `https://api.mercadosliz.com:8080/api/Precios?filtro=${codigo}&page=${page}&Sucursal=${sucursal}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  }

  const GetDataCode = async (codigo: string) => {
    setError("");
    try {
      const response = await loadDate(page, codigo, sucursal);

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const { precios = [], ofertas = [] } = await response.json();

      const preciosMapeados = precios.map((precio: any) => ({
        nombre: precio.descripcion1 || "Descripción no disponible",
        precioTotal: precio.precio || 0,
        unidad: precio.unidad,
      }));

      if (ofertas.length > 0) {
        setOfertas(ofertas);
      }

      if (preciosMapeados.length >= 0) {
        setResults((prev) => [...prev, ...preciosMapeados]);
      } else {
        setError("No se encontraron precios para el código especificado.");
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al obtener los datos.");
    } finally {
      if (inputRef.current) {
        const nativeInput = await inputRef.current.getInputElement();
        nativeInput.focus();
      }
    }
  };

  const Search = (value: any) => {
    //do something
    console.log(value);

    if (value == "Enter") {
      console.log("Enter key pressed")
      //SomeCode
    }
  }

  const loadMore = (event: CustomEvent<void>) => {
    const nextPage = page + 1;
    setPage(nextPage);
    try {
      GetDataCode(query);
    } finally {
      (event.target as HTMLIonInfiniteScrollElement).complete();
    }
  };
  function Clear() {
    setQuery("");
    setPrecio("$0.00");
    setNombre("Seleccione un artículo");
    setUnidad("");
    setResults([]);
  }
  const loadSucursal = (event: CustomEvent) => {
    const value = event.detail.value;
    setSucursal(value);
  };
  const SearchF = async (value: any) => {

    if (value == "Enter") {
      setResults([]);
      const response = await loadDate(1, query, sucursal);

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const { precios = [] } = await response.json();

      const preciosMapeados = {
        nombre: precios[0].descripcion1 || "Descripción no disponible",
        precioTotal: precios[0].precio || 0,
        unidad: precios[0].unidad,
      };
      console.log(preciosMapeados);
      handleSelect(preciosMapeados)
    }
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonImg src="img/logo.png" className="w-24" />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <section className="w-full relative max-w-2xl mx-auto shadow-2xl p-6 rounded-lg bg-white">
          <IonItem className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <IonSearchbar
              autoFocus={true}
              value={query}
              ref={inputRef}
              onIonClear={Clear}
              onKeyPress={e => SearchF(e.key)}
              onIonInput={(event) => handleInput(event)}
              aria-label="Buscar artículos"
            />
            <IonSelect
              slot="start"
              placeholder="Sucursal"
              onIonChange={loadSucursal}
              onKeyPress={Search}
              value={sucursal}
              className="w-full md:w-1/5"
            >
              <IonSelectOption value="(Precio 3)">Testeraso</IonSelectOption>
              <IonSelectOption value="(Precio 2)">Guadalupe</IonSelectOption>
              <IonSelectOption value="(Precio 4)">Palmas</IonSelectOption>
              <IonSelectOption value="(Precio Lista)">Mayoreo</IonSelectOption>
            </IonSelect>
            <IonButton
              slot="end"
              type="button"
              onClick={() => GetDataCode(query)}
              className="w-full md:w-auto mt-2 md:mt-0"
            >
              <IonIcon icon={search} className="h-4 w-4 mr-2" />
              Verificar
            </IonButton>
          </IonItem>



          {query && results.length > 0 && (
            <IonContent className="absolute w-full z-20 max-h-64 m-auto overflow-y-auto bg-white shadow-md rounded-lg">
              <IonList>
                {results.map((result, index) => (
                  <IonItem key={index} button onClick={() => handleSelect(result)}>
                    <span>{result.nombre}</span>
                    <IonBadge slot="end" className="text-white mr-2">
                      {result.unidad}
                    </IonBadge>
                    <IonBadge slot="end" className="text-white" color="success">
                      ${result.precioTotal}
                    </IonBadge>
                  </IonItem>
                ))}
              </IonList>
              <IonInfiniteScroll
                onIonInfinite={(event) => loadMore(event)}>
                <IonInfiniteScrollContent loadingSpinner="bubbles" />
              </IonInfiniteScroll>
            </IonContent>
          )}

          <div className="text-center mt-4 py-2">
            <div className="flex flex-col py-2">
              <span className="font-bold text-lg">
                {nombre} {unidad && <IonBadge>{unidad}</IonBadge>}
              </span>
              <span className="text-3xl font-bold md:text-4xl">{precio}</span>
            </div>
          </div>

          {ofertas.length > 0 && (
            <div className="space-y-2 mt-6">
              <div className="flex items-center space-x-2">
                <IonIcon icon={pricetagOutline} className="h-6 w-6 text-green-500" />
                <span className="font-semibold text-base md:text-lg">Promociones</span>
              </div>
              <IonList className="p-2">
                {ofertas.map((data: any, index) => (
                  <IonItem key={index} className="text-xl font-bold text-green-600">
                    ${data.precioTotal}
                  </IonItem>
                ))}
              </IonList>
            </div>
          )}

          {error && (
            <div className="text-center text-red-600 mt-2">
              <span>{error}</span>
            </div>
          )}

          <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden md:h-64 mt-6">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Mapa de la tienda
            </div>
            <div className="absolute bottom-2 left-2 bg-white p-2 rounded-full shadow">
              <IonIcon icon={pinOutline} className="h-5 w-5 text-red-500 p-0" />
            </div>
          </div>
        </section>
      </IonContent>
    </IonPage >
  );
}

export default Test;
