import { LogIn } from 'lucide-react';
import { Surface, Button, Form, TextField, Label, Input, FieldError, Description } from '@heroui/react';

/**
 * 
 * I just need to do the onSubmit handler and the API call to the backend, 
 * but I want to make sure the form is working first before I do that. 
 * I also need to add a loading state and error handling for the API call, but I'll do that after I get the form working.
 */




function SignIn() {
  return (
    <>
      <div className="flex items-center justify-center rounded-3xl bg-surface p-6">
        <Surface className="w-full min-w-[380px]">
          <Form>
            <TextField
              isRequired
              name='email'
              type='email'
            >
              <Label>Email</Label>
              <Input placeholder='trial@example.com' />

            </TextField>
            <TextField
              isRequired
              minLength={8}
              name="password"
              type="password"
            >
              <Label>Password</Label>
              <Input placeholder="Enter your password" />
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
        </Surface>
      </div>


    </>
  )
}

export default SignIn;