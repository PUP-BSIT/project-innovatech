import { TestBed } from '@angular/core/testing';

import { LoginAuthentication } from './login-authentication.service';

describe('LoginAuthenticationService', () => {
  let service: LoginAuthentication;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginAuthentication);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
