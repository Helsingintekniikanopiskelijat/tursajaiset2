import {Injectable} from '@angular/core';
import {EditorComponentHolder} from 'src/app/models/editor-component-holder.model';

@Injectable({
  providedIn: 'root'
})
export class ComponentInstanceService {
  componentInstances: Map<string, any> = new Map();

  constructor() {
  }
  setComponent(name: string, component: any): void {
    this.componentInstances.set(name, component);
  }
  getComponent(name: string) {
    return this.componentInstances.get(name);
  }
}
