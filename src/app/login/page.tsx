'use client';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import React from 'react';
import { Button, Input, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../contexts/sessionContext';
import { apiLoginUser } from '../utils/HiddenRequests';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsEyeFill } from 'react-icons/bs';
import { TbEyeMinus } from 'react-icons/tb';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { LoginDto } from '@/Api';

function LoginPage() {
  const { getMyInfo } = useAuthContext();
  const defaultValues: LoginDto = {
    email: 'info@capacityvietnam.com',
    password: 'capacityvietnam123'
  };

  const {
    mutate: login,
    error,
    isPending
  } = useMutation({
    mutationKey: ['login'],
    mutationFn: apiLoginUser,
    onSuccess: async () => {
      await getMyInfo();
      toast.success('Welcome back! You\'ve successfully logged in.');
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  });

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginDto>({
    defaultValues
  });

  const onSubmit: SubmitHandler<LoginDto> = (data) => login(data);

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-gray-100 ">
      {/* Left Section - Login Form */}
      <div
        className="flex-1 flex items-center justify-center p-4 md:p-8"
      >
        <Card className="w-full max-w-md bg-white/80  backdrop-blur-sm shadow-xl">
          <CardHeader className="flex flex-col gap-1 p-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.png"
                width={180}
                height={180}
                alt="logo"
                className="transition-transform hover:scale-105"
              />
            </div>
            <h1 className="text-3xl font-bold text-center text-[#0E224C]">
              Welcome Back
            </h1>
            <p className="text-center text-gray-600 ">
              Sign in to access your dashboard
            </p>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Input
                  value={watch('email') || defaultValues.email}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  isInvalid={!!errors.email}
                  errorMessage={errors?.email?.message}
                  size="lg"
                  variant="bordered"
                  startContent={<FiMail className="text-xl text-gray-400" />}
                  className="w-full"
                  placeholder="Enter your email"
                  type="email"
                  classNames={{
                    input: "text-base",
                    inputWrapper: "h-12"
                  }}
                />
              </div>

              <div className="space-y-2">
                <Input
                  value={watch('password') || defaultValues.password}
                  size="lg"
                  variant="bordered"
                  startContent={<FiLock className="text-xl text-gray-400" />}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <BsEyeFill className="text-xl text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <TbEyeMinus className="text-xl text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  isInvalid={!!errors.password}
                  errorMessage={errors?.password?.message}
                  className="w-full"
                  placeholder="Enter your password"
                  classNames={{
                    input: "text-base",
                    inputWrapper: "h-12"
                  }}
                />
              </div>

              {error && (
                <div
                  className="p-3 rounded-lg bg-red-50  text-red-600  text-sm"
                >
                  {typeof error === 'object' && error.response?.data?.message
                    ? error.response.data.message
                    : error.message || 'An error occurred'}
                </div>
              )}
              <Button
                type="submit"
                size="lg"
                color="primary"
                className="w-full h-12 font-semibold text-base"
                isLoading={isPending}
                endContent={!isPending && <FiArrowRight className="text-xl" />}
              >
                {isPending ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
