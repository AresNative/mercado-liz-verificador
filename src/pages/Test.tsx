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
} from '@ionic/react';
import { pinOutline, pricetagOutline, search } from 'ionicons/icons';

function Test() {
    const inputRef = useRef<HTMLIonSearchbarElement | null>(null);

    const [results, setResults] = useState<any[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [precio, setPrecio] = useState<string>("$0.00");
    const [nombre, setNombre] = useState<string>("Seleccione un artículo");
    const [unidad, setUnidad] = useState<string | undefined>();
    const [error, setError] = useState<string>("");
    const [sucursal, setSucursal] = useState<string>("(Precio 2)");
    const [ofertas, setOfertas] = useState<any[]>([]);
    const [page, setPage] = useState(1);

    const handleInput = async (event: CustomEvent) => {
        const value = event.detail.value ?? '';
        setQuery(value);
        setPage(1);
        setResults([]);
        setHasMore(true);

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
        setIsLoading(true);

        try {
            const response = await loadDate(page, codigo, sucursal);

            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }

            const { precios = [], ofertas = [] } = await response.json();

            const preciosMapeados = precios.slice(0, 10).map((precio: any) => ({
                nombre: precio.descripcion1 || "Descripción no disponible",
                precioTotal: precio.precio || 0,
                unidad: precio.unidad,
            }));

            if (ofertas.length > 0) {
                setOfertas(ofertas);
            }

            if (preciosMapeados.length > 0) {
                setResults((prevResults) => [...prevResults, ...preciosMapeados]);
                if (preciosMapeados.length < 10) {
                    setHasMore(false); // No hay más datos
                }
            } else {
                setHasMore(false);
                setError("No se encontraron precios para el código especificado.");
            }
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error al obtener los datos.");
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = async (event: CustomEvent<void>) => {
        const nextPage = page + 1;
        setPage(nextPage);

        try {
            await GetDataCode(query);
        } finally {
            (event.target as HTMLIonInfiniteScrollElement).complete();
        }
    };

    const loadSucursal = (event: CustomEvent) => {
        const value = event.detail.value;
        setSucursal(value);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonImg src="img/logo.png" className="w-24" />
            </IonHeader>
            <IonContent>
                <section className="w-2/3 h-fit m-auto shadow-2xl p-4 rounded-md relative">
                    <IonItem>
                        <IonSearchbar
                            value={query}
                            debounce={300}
                            onIonInput={(event) => handleInput(event)}
                            ref={inputRef}
                            aria-label="Buscar artículos"
                        />
                        <IonSelect
                            slot="start"
                            aria-label="Sucursal"
                            placeholder="Sucursal"
                            onIonChange={loadSucursal}
                            value={sucursal}
                        >
                            <IonSelectOption value="(Precio 3)">Testeraso</IonSelectOption>
                            <IonSelectOption value="(Precio 2)">Guadalupe</IonSelectOption>
                            <IonSelectOption value="(Precio 4)">Palmas</IonSelectOption>
                            <IonSelectOption value="(Precio Lista)">Mayoreo</IonSelectOption>
                        </IonSelect>
                        <IonButton slot="end" type="button" onClick={() => GetDataCode(query)}>
                            <IonIcon icon={search} className="h-4 w-4 mr-2" />
                            Verificar
                        </IonButton>
                    </IonItem>

                    {isLoading && <IonSpinner name="crescent" />}

                    {query && results.length > 0 && (
                        <div>
                            <IonInfiniteScroll
                                onIonInfinite={(event) => loadMore(event)}
                                disabled={!hasMore} // Desactivar si no hay más datos
                            >
                                <IonList
                                    aria-live="polite"
                                    className="absolute w-full z-20 max-h-64 m-auto overflow-y-auto bg-white shadow-md rounded-lg"
                                >
                                    {results.map((result, index) => {
                                        console.log(results)

                                        return (
                                            <IonItem key={index} button onClick={() => handleSelect(result)}>
                                                <span>{result.nombre}</span> <IonBadge slot='end' className='text-white' color={'success'}>${result.precioTotal}</IonBadge>
                                            </IonItem>
                                        )
                                    })}
                                </IonList>
                                <IonInfiniteScrollContent loadingSpinner="bubbles" />
                            </IonInfiniteScroll>
                        </div>
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
                            <IonIcon icon={pinOutline} className="h-6 w-6 text-red-500" />
                        </div>
                    </div>
                </section>
            </IonContent>
        </IonPage>
    );
}

export default Test;
