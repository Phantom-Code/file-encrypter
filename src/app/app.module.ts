import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import{FormsModule} from '@angular/forms'
import { AppComponent } from './app.component';
import { FilePickerComponent } from './components/file-picker/file-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    FilePickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
