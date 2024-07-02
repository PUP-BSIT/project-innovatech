import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ShareCommunityService {
  private sharedRecipeSource = new BehaviorSubject<any>(null);
  sharedRecipe$ = this.sharedRecipeSource.asObservable();

  shareRecipe(recipe: any): void {
    this.sharedRecipeSource.next(recipe);
  }
}