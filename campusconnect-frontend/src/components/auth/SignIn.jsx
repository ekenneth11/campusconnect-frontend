import { LogIn } from 'lucide-react';
import { Button, Form, TextField, Label, Input, FieldError, Description } from '@heroui/react';

/**
 * 
 * I just need to do the onSubmit handler and the API call to the backend, 
 * but I want to make sure the form is working first before I do that. 
 * I also need to add a loading state and error handling for the API call, but I'll do that after I get the form working.
 */




function SignIn() {
  return (
    <>
      <Form className='flex w-96 flex-col gap-4'>
        <TextField
          isRequired
          name='email'
          type='email'
          validate={(value) => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
              return "Please enter a valid email address";
            }
            return null;
          }}
        >
          <Label>Email</Label>
          <Input placeholder='trial@example.com' />
          <FieldError />
        </TextField>
        <TextField
          isRequired
          minLength={8}
          name="password"
          type="password"
          validate={(value) => {
            if (value.length < 8) {
              return "Password must be at least 8 characters";
            }
            if (!/[A-Z]/.test(value)) {
              return "Password must contain at least one uppercase letter";
            }
            if (!/[0-9]/.test(value)) {
              return "Password must contain at least one number";
            }
            return null;
          }}
        >
          <Label>Password</Label>
          <Input placeholder="Enter your password" />
          <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
          <FieldError />
        </TextField>
        <div className="flex gap-2">
          <Button type="submit">
            <LogIn />
            Sign in
          </Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
      </Form>


    </>
  )
}

export default SignIn;