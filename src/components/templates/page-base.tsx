import {  IonPage, IonContent, IonHeader, IonToolbar, IonTitle } from "@ionic/react"
import '@/components/templates/page-base.css'


interface ContainerProps { children:React.ReactNode, titulo?:string}
 const PageBase: React.FC<ContainerProps> = ({children, titulo}) => {

      return (
    <IonPage >
      <IonHeader >
        <IonToolbar>
          <IonTitle>
            {titulo}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <img src="img/logo.png" className="imglogo"/>
      <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle className="iontitle">
          {titulo}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      {children}
    
      <img src="img/uvas.png" className="imgdetalles uva1" />
      <img src="img/uvas.png" className="imgdetalles uva2" />
      <img src="img/uvas.png" className="imgdetalles uva3" />
 
      </IonContent> 
    </IonPage>
  );
};


export default PageBase