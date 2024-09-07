import {  IonPage, IonContent } from "@ionic/react"
import '@/components/templates/page-base.css'


interface ContainerProps { children:React.ReactNode}
 const PageBase: React.FC<ContainerProps> = ({children}) => {

      return (
    <IonPage >
      
      <img src="img/logo.png" className="imglogo"/>
      <IonContent>

        
      {children}
       
            
      <img src="img/uvas.png" className="imgdetalles uva1" />
      <img src="img/uvas.png" className="imgdetalles uva2" />
      <img src="img/uvas.png" className="imgdetalles uva3" />
     
    
       
      </IonContent> 
    </IonPage>
  );
};


export default PageBase