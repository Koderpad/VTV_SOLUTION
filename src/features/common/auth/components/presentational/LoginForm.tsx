import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onSubmit: (data: { username: string; password: string }) => void;
  errMsg?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, errMsg }) => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập vào VTV</CardTitle>
        <CardDescription>Nhập tài khoản của bạn để đăng nhập</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Tài khoản</Label>
            <Input
              id="username"
              type="text"
              placeholder=""
              required
              value={username}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Mật khẩu</Label>
              <a
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Quên mật khẩu?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errMsg && <div className="text-red-500 text-sm">{errMsg}</div>}
          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Chưa có tài khoản?{" "}
          <a href="/register" className="underline">
            Đăng ký
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
