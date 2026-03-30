import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CirclePlus } from 'lucide-react';
import { Surface, Form, Fieldset, TextField, Label, Input, Button, FieldError, Alert } from '@heroui/react';
import userApi from '../../api/api-user';

function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            await userApi.register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleReset = () => {
        setFormData({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: ''
        });
        setError('');
    };

    const validateFirstName = (value) => {
        if (!value || value.length < 3) {
            return "First Name must be at least 3 characters";
        }
        return null;
    };

    const validateLastName = (value) => {
        if (!value || value.length < 3) {
            return "Last Name must be at least 3 characters";
        }
        return null;
    };

    const validateUsername = (value) => {
        if (!value || value.length < 3) {
            return "Username must be at least 3 characters";
        }
        return null;
    };

    const validateEmail = (value) => {
        if (!value || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return "Please enter a valid email address";
        }
        return null;
    };

    const validatePassword = (value) => {
        if (!value || value.length < 8) {
            return "Password must be at least 8 characters";
        }
        if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/[0-9]/.test(value)) {
            return "Password must contain at least one number";
        }
        return null;
    };

    return (
        <>
            <div className="flex items-center justify-center rounded-3xl bg-surface p-6">
                <Surface className="w-full min-w-[380px]">
                    <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                    {error && (
                        <Alert color="danger" className="mb-4">
                            {error}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Fieldset className="w-full">
                            <Fieldset.Legend>Create Account</Fieldset.Legend>
                            <Fieldset.Group>
                                <TextField
                                    isRequired
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    validate={validateFirstName}
                                >
                                    <Label>First Name</Label>
                                    <Input placeholder="John" variant="secondary" />
                                    <FieldError />
                                </TextField>
                                <TextField
                                    isRequired
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    validate={validateLastName}
                                >
                                    <Label>Last Name</Label>
                                    <Input placeholder="Doe" variant="secondary" />
                                    <FieldError />
                                </TextField>
                                <TextField
                                    isRequired
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    validate={validateUsername}
                                >
                                    <Label>Username</Label>
                                    <Input placeholder="johndoe" variant="secondary" />
                                    <FieldError />
                                </TextField>
                                <TextField
                                    isRequired
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    validate={validateEmail}
                                >
                                    <Label>Email</Label>
                                    <Input placeholder="trial@example.com" variant="secondary" />
                                    <FieldError />
                                </TextField>
                                <TextField
                                    isRequired
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    validate={validatePassword}
                                >
                                    <Label>Password</Label>
                                    <Input placeholder="Enter your password" variant="secondary" />
                                    <FieldError />
                                </TextField>
                            </Fieldset.Group>
                            <Fieldset.Actions>
                                <div className="flex gap-2 justify-end">
                                    <Button type="submit" isLoading={isLoading} color="primary">
                                        <CirclePlus />
                                        Sign up
                                    </Button>
                                    <Button type="button" variant="secondary" onClick={handleReset}>
                                        Reset
                                    </Button>
                                </div>
                            </Fieldset.Actions>
                        </Fieldset>
                    </Form>
                </Surface>
            </div>
        </>
    );
}

export default Register;