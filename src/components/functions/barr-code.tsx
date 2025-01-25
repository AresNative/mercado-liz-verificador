import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonButton, IonText, IonLoading } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Plugins } from '@capacitor/core';

const { Permissions } = Plugins;

const BarcodeScanner: React.FC = () => {
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasPermission, setHasPermission] = useState<boolean>(false);

    useEffect(() => {
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        try {
            const permissionStatus = await Permissions.request({ name: 'camera' });
            if (permissionStatus.camera === 'granted') {
                setHasPermission(true);
            } else {
                setError('Permiso de cámara denegado. Ve a Configuración para habilitarlo.');
            }
        } catch (error) {
            console.error('Error al solicitar permisos de cámara', error);
            setError('Error al solicitar permisos de cámara');
        }
    };

    const startScanning = async () => {
        if (!hasPermission) {
            setError('Primero debes permitir el acceso a la cámara.');
            return;
        }

        try {
            setLoading(true);
            const photo = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera, // Usar la cámara directamente
            });

            if (photo && photo.webPath) {
                setScannedCode('Código escaneado exitosamente');
            }
        } catch (err) {
            console.error('Error al acceder a la cámara', err);
            setError('No se pudo acceder a la cámara.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <h1 className="text-3xl font-semibold text-center mb-6">Lector de Código de Barras</h1>

                {/* Permisos de cámara */}
                {!hasPermission ? (
                    <div className="mb-4">
                        <IonButton onClick={requestPermissions} expand="full" color="primary">
                            Solicitar Permiso para la Cámara
                        </IonButton>
                        {error && <IonText color="danger">{error}</IonText>}
                    </div>
                ) : (
                    <IonButton onClick={startScanning} expand="full" color="primary">
                        Iniciar Escaneo
                    </IonButton>
                )}

                {loading && <IonLoading isOpen={loading} message="Escaneando..." />}

                {scannedCode && (
                    <IonText color="success" className="block mt-4">
                        Código escaneado: {scannedCode}
                    </IonText>
                )}
            </IonContent>
        </IonPage>
    );
};

export default BarcodeScanner;
