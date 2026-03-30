import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Surface, Button, Form, TextField, Label, Input, Alert } from '@heroui/react';
import userApi from '../../datasource/api-user';

function SignIn() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            await userApi.signin(formData);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
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
            email: '',
            password: ''
        });
        setError('');
    };

    return (
        <>
            <div className="flex items-center justify-center rounded-3xl bg-surface p-6">
                <Surface className="w-full min-w-[380px]">
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
                    {error && (
                        <Alert color="danger" className="mb-4">
                            {error}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <TextField
                            isRequired
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mb-4"
                        >
                            <Label>Email</Label>
                            <Input placeholder="trial@example.com" />
                        </TextField>
                        <TextField
                            isRequired
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mb-4"
                        >
                            <Label>Password</Label>
                            <Input placeholder="Enter your password" />
                        </TextField>
                        <div className="flex gap-2 justify-end">
                            <Button type="submit" isLoading={isLoading} color="primary">
                                <LogIn />
                                Sign in
                            </Button>
                            <Button type="button" variant="secondary" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                    </Form>
                </Surface>
            </div>
        </>
    );
}

export default SignIn;