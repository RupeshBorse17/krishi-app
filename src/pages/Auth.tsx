// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import { useLang } from "@/contexts/LanguageContext";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { motion } from "framer-motion";
// import { Languages, LogIn, UserPlus, Loader2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const Auth = () => {
//   const { tr, lang, toggleLang } = useLang();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [fullName, setFullName] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (isLogin) {
//         const { error } = await supabase.auth.signInWithPassword({ email, password });
//         if (error) throw error;
//         navigate("/");
//       } else {
//         const { error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             data: { full_name: fullName },
//             emailRedirectTo: window.location.origin,
//           },
//         });
//         if (error) throw error;
//         toast({
//           title: tr("signupSuccess"),
//           description: tr("signupSuccessDesc"),
//         });
//         navigate("/");
//       }
//     } catch (error: any) {
//       toast({
//         title: tr("error"),
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-sm"
//       >
//         {/* Header */}
//         <div className="text-center mb-6">
//           <span className="text-5xl">🌾</span>
//           <h1 className="text-2xl font-bold text-foreground mt-2">{tr("appName")}</h1>
//           <p className="text-muted-foreground text-sm mt-1">
//             {isLogin ? tr("loginSubtitle") : tr("signupSubtitle")}
//           </p>
//         </div>

//         {/* Language Toggle */}
//         <div className="flex justify-center mb-4">
//           <button
//             onClick={toggleLang}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-semibold text-foreground border border-border"
//           >
//             <Languages size={16} />
//             {lang === "mr" ? "EN" : "मरा"}
//           </button>
//         </div>

//         <Card className="glass-card">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg text-center">
//               {isLogin ? tr("login") : tr("signup")}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {!isLogin && (
//                 <div className="space-y-2">
//                   <Label htmlFor="fullName">{tr("fullName")}</Label>
//                   <Input
//                     id="fullName"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     placeholder={tr("fullNamePlaceholder")}
//                     required
//                   />
//                 </div>
//               )}
//               <div className="space-y-2">
//                 <Label htmlFor="email">{tr("emailLabel")}</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder={tr("emailPlaceholder")}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">{tr("passwordLabel")}</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder={tr("passwordPlaceholder")}
//                   required
//                   minLength={6}
//                 />
//               </div>
//               <Button type="submit" className="w-full" disabled={loading}>
//                 {loading ? (
//                   <Loader2 className="animate-spin" size={18} />
//                 ) : isLogin ? (
//                   <>
//                     <LogIn size={18} /> {tr("login")}
//                   </>
//                 ) : (
//                   <>
//                     <UserPlus size={18} /> {tr("signup")}
//                   </>
//                 )}
//               </Button>
//             </form>
//             <div className="mt-4 text-center">
//               <button
//                 onClick={() => setIsLogin(!isLogin)}
//                 className="text-sm text-primary font-medium hover:underline"
//               >
//                 {isLogin ? tr("noAccount") : tr("hasAccount")}
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// };

// export default Auth;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Languages, LogIn, UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { tr, lang, toggleLang } = useLang();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: tr("signupSuccess"),
          description: tr("signupSuccessDesc"),
        });
        navigate("/");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error);
      toast({
        title: tr("error"),
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-5xl">🌾</span>
          <h1 className="text-2xl font-bold text-foreground mt-2">{tr("appName")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLogin ? tr("loginSubtitle") : tr("signupSubtitle")}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-semibold text-foreground border border-border"
          >
            <Languages size={16} />
            {lang === "mr" ? "EN" : "मरा"}
          </button>
        </div>

        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center">
              {isLogin ? tr("login") : tr("signup")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">{tr("fullName")}</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={tr("fullNamePlaceholder")}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{tr("emailLabel")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tr("emailPlaceholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{tr("passwordLabel")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tr("passwordPlaceholder")}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : isLogin ? (
                  <>
                    <LogIn size={18} /> {tr("login")}
                  </>
                ) : (
                  <>
                    <UserPlus size={18} /> {tr("signup")}
                  </>
                )}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary font-medium hover:underline"
              >
                {isLogin ? tr("noAccount") : tr("hasAccount")}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;