import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  showSavedRecipes: boolean = false;
  showMealPlanning: boolean = false;
  showActivityLog: boolean = false;
  showEditModal: boolean = false;
  showAvatarModal: boolean = false;
  showShareRecipeModal: boolean = false;
  selectedFile: File | null = null;

  recipeForm: FormGroup;
  userProfile: any = {};

  // user = {
  //   name: 'Jane Dee',
  //   description: 'Hello fellow food enthusiasts! I\'m Jane, \
  //   a dedicated foodie and a weekend chef, \
  //   always on the hunt for exciting new flavors and unique recipes.',    
  //   password: ''
  // };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder, 
    private userService: UserService
  ){}

  ngOnInit() {
    this.getUserProfile();
    this.initRecipeForm();
    
    this.route.queryParams.subscribe(params => {
      if (params['showSavedRecipes']) {
        this.showSavedRecipes = true;
        this.showMealPlanning = false;
        this.showActivityLog = false;
      }
    });
  }

  getUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (data: any) => {
        this.userProfile = data;
        console.log(this.userProfile);
      },
      error: (error: any) => {
        console.error("Error fetching user profile:", error);  
      }
    });
  }

  openShareRecipeModal() {
    this.showShareRecipeModal = true;
  }

  closeShareRecipeModal() {
    this.showShareRecipeModal = false;
  }

  initRecipeForm(): void {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      mealType: ['', Validators.required],
      dietaryPreferences: ['', Validators.required],
      hours: [null, Validators.required],
      minutes: [null, Validators.required],
      servings: ['', Validators.required],
      ingredients: this.fb.array([]),
      instructions: this.fb.array([]),
      image: [null]
    });
    this.addIngredient();
    this.addInstruction();
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.fb.group({
      name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0)]]
    }));
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  addInstruction(): void {
    this.instructions.push(this.fb.group({
      step: ['', Validators.required]
    }));
  }

  removeInstruction(index: number): void {
    this.instructions.removeAt(index);
  }

  toggleSavedRecipes() {
    this.showSavedRecipes = !this.showSavedRecipes;
    this.showMealPlanning = false;
    this.showActivityLog = false;
  }

  toggleMealPlanning() {
    this.showMealPlanning = !this.showMealPlanning;
    this.showSavedRecipes = false;
    this.showActivityLog = false;
  }

  toggleActivityLog() {
    this.showActivityLog = !this.showActivityLog;
    this.showSavedRecipes = false;
    this.showMealPlanning = false;
  }

  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  saveChanges() {
    console.log('Saving changes:', this.userProfile);
    this.closeEditModal();
  }

  changeAvatar() {
    this.showAvatarModal = true;
  }

  closeAvatarModal() {
    this.showAvatarModal = false;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadAvatar() {
    if (this.selectedFile) {
      console.log('Uploading file:', this.selectedFile);
      this.closeAvatarModal();
    }
  }
}