import { CirclePlus } from 'lucide-react';
import { Surface, Form, Fieldset, TextField, Label, Input, Button, FieldError } from '@heroui/react';
/**
 * 
 * firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: 'student' // Default role, can be changed as needed 
 */
//addding the onSubmit later
function Register() {
    return (
        <>
            <div className="flex items-center justify-center rounded-3xl bg-surface p-6">
                <Surface className="w-full min-w-[380px]">
                    <Form>
                        <Fieldset className='w-full'>
                            <Fieldset.Legend>Register</Fieldset.Legend>
                            <Fieldset.Group>
                                <TextField
                                    isRequired
                                    label="First Name"
                                    name="firstName"
                                    validate={(value) => {
                                        if (value.length < 3) {
                                            return "First Name must be at least 3 characters";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label>First Name</Label>
                                    <Input placeholder='John' variant='secondary' />
                                    <FieldError />

                                </TextField>
                                <TextField
                                    isRequired
                                    label="Last Name"
                                    name="lastName"
                                    validate={(value) => {
                                        if (value.length < 3) {
                                            return "Last Name must be at least 3 characters";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label>Last Name</Label>
                                    <Input placeholder='Doe' variant='secondary' />
                                    <FieldError />
                                </TextField>
                                <TextField
                                    isRequired
                                    label="Username"
                                    name="username"
                                    validate={(value) => {
                                        if (value.length < 3) {
                                            return "Username must be at least 3 characters";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label>Username</Label>
                                    <Input placeholder='johndoe' variant='secondary' />
                                    <FieldError />
                                </TextField>
                                <TextField
                                    isRequired
                                    label="Email"
                                    name="email"
                                    type="email"
                                    validate={(value) => {
                                        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                            return "Please enter a valid email address";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label>Email</Label>
                                    <Input placeholder='trial@example.com' variant='secondary' />
                                    <FieldError />
                                </TextField>
                                <TextField
                                    isRequired
                                    label="Password"
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
                                    <Input placeholder="Enter your password" variant='secondary' />
                                    <FieldError />
                                </TextField>
                            </Fieldset.Group>
                            <Fieldset.Actions>
                                <div className="flex gap-2">
                                    <Button type="submit">
                                        <CirclePlus />
                                        Sign up
                                    </Button>
                                    <Button type="reset" variant="secondary">
                                        Reset
                                    </Button>
                                </div>
                            </Fieldset.Actions>
                        </Fieldset>
                    </Form>
                </Surface>
            </div>
        </>
    )
}
export default Register;