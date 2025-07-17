"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Star,
  Sparkles,
  Gift,
  Users,
  Flower,
  Crown,
  Diamond,
  Music,
} from "lucide-react";

// Registrar el plugin de ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface WeddingConfig {
  brideName: string;
  groomName: string;
  weddingDate: string;
  ceremonyLocation: string;
  ceremonyAddress: string;
  ceremonyMapIframe?: string;
  receptionLocation: string;
  receptionAddress: string;
  receptionMapIframe?: string;
  backgroundImage?: string;
  brideImage?: string;
  groomImage?: string;
  coupleImage?: string;
  welcomeMessage: string;
  ourStory?: string;
}

interface Guest {
  id: string;
  name: string;
  guestNumber: number;
  code: string;
  hasResponded: boolean;
  attending: boolean;
  guestCount: number;
  comments?: string;
}

export default function WeddingInvitation() {
  const [weddingConfig, setWeddingConfig] = useState<WeddingConfig | null>(
    null
  );
  const [guest, setGuest] = useState<Guest | null>(null);
  const [guestNumber, setGuestNumber] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // RSVP form state
  const [attending, setAttending] = useState<boolean>(true);
  const [guestCount, setGuestCount] = useState(1);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Refs para las animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const coupleRef = useRef<HTMLDivElement>(null);
  const ceremonyRef = useRef<HTMLDivElement>(null);
  const receptionRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar configuración de la boda
    fetchWeddingConfig();
  }, []);

  useEffect(() => {
    if (weddingConfig && containerRef.current) {
      initializeGSAPAnimations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingConfig]);

  const fetchWeddingConfig = async () => {
    try {
      const response = await fetch("/api/wedding-config");
      const data = await response.json();
      setWeddingConfig(data);
    } catch (error) {
      console.error("Error fetching wedding config:", error);
      // Configuración por defecto si no se puede cargar
      setWeddingConfig({
        brideName: "Novia",
        groomName: "Novio",
        weddingDate: "2024-12-31",
        ceremonyLocation: "Iglesia",
        ceremonyAddress: "Dirección de la ceremonia",
        receptionLocation: "Salón de fiestas",
        receptionAddress: "Dirección de la recepción",
        welcomeMessage: "¡Nos casamos!",
        ourStory:
          "Después de años juntos, hemos decidido dar el siguiente paso en nuestra historia de amor. Queremos compartir este momento especial contigo y con todos nuestros seres queridos.",
      });
    }
  };

  const initializeGSAPAnimations = () => {
    // Limpiar animaciones anteriores
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Animación del sobre inicial - mantener orientación correcta
    gsap.set(envelopeRef.current, {
      scale: 1,
      rotation: 0,
      transformOrigin: "center center",
    });

    // Animación del contenido inicialmente oculto
    gsap.set(contentRef.current, {
      opacity: 0,
      y: 100,
    });

    // Animación del scroll para abrir el sobre
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "100px top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress > 0.3 && !isEnvelopeOpen) {
          setIsEnvelopeOpen(true);
          gsap.to(envelopeRef.current, {
            scale: 0.8,
            y: -100,
            duration: 0.8,
            ease: "power2.out",
          });
          gsap.to(contentRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.3,
            ease: "power2.out",
          });
        }
      },
    });

    // Animaciones de las secciones con elementos decorativos
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        }
      );
    }

    if (coupleRef.current) {
      gsap.fromTo(
        coupleRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: coupleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        }
      );
    }

    if (ceremonyRef.current) {
      gsap.fromTo(
        ceremonyRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: ceremonyRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        }
      );
    }

    if (receptionRef.current) {
      gsap.fromTo(
        receptionRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: receptionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        }
      );
    }

    if (confirmationRef.current) {
      gsap.fromTo(
        confirmationRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: confirmationRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        }
      );
    }
  };

  const validateGuest = async () => {
    if (!guestNumber || !code) {
      setError("Por favor ingresa el número de invitado y código");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/guest/validate?guestNumber=${guestNumber}&code=${code}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Datos no válidos");
        return;
      }

      setGuest(data);
      setShowConfirmation(true);
      if (data.hasResponded) {
        setSubmitted(true);
      }
    } catch (err) {
      setError("Error al validar los datos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const submitRSVP = async () => {
    if (!guest) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/guest/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestNumber: guest.guestNumber,
          code: guest.code,
          attending,
          guestCount: attending ? guestCount : 0,
          comments,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al enviar respuesta");
        return;
      }

      setSubmitted(true);
      setGuest(data);
    } catch (err) {
      setError("Error al enviar respuesta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!weddingConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-rose-600">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        backgroundImage: weddingConfig.backgroundImage
          ? `url(${weddingConfig.backgroundImage})`
          : "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Elementos decorativos flotantes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Star className="absolute top-20 left-10 h-6 w-6 text-rose-300 animate-pulse" />
        <Sparkles className="absolute top-32 right-20 h-8 w-8 text-rose-400 animate-bounce" />
        <Heart className="absolute top-60 left-1/4 h-4 w-4 text-rose-200 animate-pulse" />
        <Flower className="absolute bottom-40 right-10 h-6 w-6 text-rose-300 animate-pulse" />
        <Crown className="absolute top-80 right-1/4 h-5 w-5 text-rose-400 animate-bounce" />
        <Diamond className="absolute bottom-60 left-16 h-4 w-4 text-rose-200 animate-pulse" />
        <Music className="absolute top-1/2 left-10 h-5 w-5 text-rose-300 animate-pulse" />
      </div>

      {/* Sobre cerrado inicial - pantalla completa */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          ref={envelopeRef}
          className="relative w-full max-w-4xl h-96 bg-white rounded-2xl shadow-2xl cursor-pointer transform-gpu overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          }}
        >
          {/* Decoración del sobre */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4">
              <Heart className="h-8 w-8 text-rose-400" />
            </div>
            <div className="absolute top-4 right-4">
              <Heart className="h-8 w-8 text-rose-400" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Flower className="h-6 w-6 text-rose-300" />
            </div>
            <div className="absolute bottom-4 right-4">
              <Flower className="h-6 w-6 text-rose-300" />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Heart className="h-20 w-20 text-rose-500 mx-auto mb-6" />
              </motion.div>
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-rose-800 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {weddingConfig.brideName} & {weddingConfig.groomName}
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-rose-600 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                {weddingConfig.welcomeMessage}
              </motion.p>
              <motion.div
                className="flex items-center justify-center gap-3 text-rose-700 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <Calendar className="h-6 w-6" />
                <p className="text-lg">
                  {new Date(weddingConfig.weddingDate).toLocaleDateString(
                    "es-ES",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </motion.div>
              <motion.p
                className="text-rose-500 text-lg animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                Desplázate para abrir la invitación
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la invitación */}
      <div ref={contentRef} className="space-y-32 pb-20">
        {/* Sección Hero */}
        <div
          ref={heroRef}
          className="min-h-screen flex items-center justify-center px-4"
        >
          <div className="text-center max-w-4xl">
            <motion.div className="relative">
              <h1 className="text-5xl md:text-7xl font-bold text-rose-800 mb-8">
                {weddingConfig.brideName} & {weddingConfig.groomName}
              </h1>
              <div className="absolute -top-8 -left-8">
                <Crown className="h-12 w-12 text-rose-400 animate-bounce" />
              </div>
              <div className="absolute -top-8 -right-8">
                <Crown className="h-12 w-12 text-rose-400 animate-bounce" />
              </div>
            </motion.div>
            <p className="text-2xl md:text-3xl text-rose-600 mb-12">
              {weddingConfig.welcomeMessage}
            </p>
            <div className="flex items-center justify-center gap-6 text-rose-700 mb-8">
              <Calendar className="h-8 w-8" />
              <p className="text-xl md:text-2xl">
                {new Date(weddingConfig.weddingDate).toLocaleDateString(
                  "es-ES",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
            <div className="flex justify-center gap-8 text-rose-500">
              <Gift className="h-8 w-8 animate-pulse" />
              <Heart className="h-8 w-8 animate-pulse" />
              <Sparkles className="h-8 w-8 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Sección de la pareja */}
        <div
          ref={coupleRef}
          className="min-h-screen flex items-center justify-center px-4"
        >
          <div className="max-w-6xl w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-rose-800 mb-4">
                Nuestra Historia
              </h2>
              <div className="flex justify-center gap-4 mb-8">
                <Star className="h-6 w-6 text-rose-400" />
                <Heart className="h-6 w-6 text-rose-500" />
                <Star className="h-6 w-6 text-rose-400" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {weddingConfig.brideImage && (
                  <div className="relative">
                    <img
                      src={weddingConfig.brideImage}
                      alt={weddingConfig.brideName}
                      className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-xl">
                      <h3 className="font-bold text-rose-800 text-lg">
                        {weddingConfig.brideName}
                      </h3>
                      <Crown className="h-5 w-5 text-rose-400 mt-1" />
                    </div>
                  </div>
                )}
                {weddingConfig.groomImage && (
                  <div className="relative">
                    <img
                      src={weddingConfig.groomImage}
                      alt={weddingConfig.groomName}
                      className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-xl">
                      <h3 className="font-bold text-rose-800 text-lg">
                        {weddingConfig.groomName}
                      </h3>
                      <Diamond className="h-5 w-5 text-rose-400 mt-1" />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-8">
                {weddingConfig.coupleImage && (
                  <div className="relative">
                    <img
                      src={weddingConfig.coupleImage}
                      alt="Pareja"
                      className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Heart className="h-8 w-8 text-rose-500" />
                    </div>
                  </div>
                )}
                <div className="bg-white/90 p-8 rounded-2xl shadow-xl">
                  <p className="text-rose-700 text-lg leading-relaxed">
                    {weddingConfig.ourStory ||
                      "Después de años juntos, hemos decidido dar el siguiente paso en nuestra historia de amor. Queremos compartir este momento especial contigo y con todos nuestros seres queridos."}
                  </p>
                  <div className="flex justify-center gap-4 mt-6">
                    <Sparkles className="h-5 w-5 text-rose-400" />
                    <Heart className="h-5 w-5 text-rose-500" />
                    <Sparkles className="h-5 w-5 text-rose-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Ceremonia */}
        <div
          ref={ceremonyRef}
          className="min-h-screen flex items-center justify-center px-4"
        >
          <div className="max-w-5xl w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-rose-800 mb-4">
                Ceremonia
              </h2>
              <div className="flex justify-center gap-4 mb-8">
                <Music className="h-6 w-6 text-rose-400" />
                <Heart className="h-6 w-6 text-rose-500" />
                <Music className="h-6 w-6 text-rose-400" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="bg-white/95 p-8 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="h-8 w-8 text-rose-600" />
                    <h3 className="text-2xl md:text-3xl font-bold text-rose-800">
                      {weddingConfig.ceremonyLocation}
                    </h3>
                  </div>
                  <p className="text-rose-700 text-lg mb-6">
                    {weddingConfig.ceremonyAddress}
                  </p>
                  <div className="flex items-center gap-3 text-rose-600">
                    <Clock className="h-6 w-6" />
                    <p className="text-lg">17:00 hrs</p>
                  </div>
                </div>
              </div>
              <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
                {weddingConfig.ceremonyMapIframe ? (
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: weddingConfig.ceremonyMapIframe
                        .replace(/width="[^"]*"/g, 'width="100%"')
                        .replace(/height="[^"]*"/g, 'height="100%"'),
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-rose-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-rose-400 mx-auto mb-2" />
                      <p className="text-rose-600">Mapa no configurado</p>
                      <p className="text-rose-500 text-sm">
                        Configura el iframe en el panel de admin
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección Recepción */}
        <div
          ref={receptionRef}
          className="min-h-screen flex items-center justify-center px-4"
        >
          <div className="max-w-5xl w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-rose-800 mb-4">
                Recepción
              </h2>
              <div className="flex justify-center gap-4 mb-8">
                <Gift className="h-6 w-6 text-rose-400" />
                <Heart className="h-6 w-6 text-rose-500" />
                <Gift className="h-6 w-6 text-rose-400" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
                {weddingConfig.receptionMapIframe ? (
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: weddingConfig.receptionMapIframe
                        .replace(/width="[^"]*"/g, 'width="100%"')
                        .replace(/height="[^"]*"/g, 'height="100%"'),
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-rose-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-rose-400 mx-auto mb-2" />
                      <p className="text-rose-600">Mapa no configurado</p>
                      <p className="text-rose-500 text-sm">
                        Configura el iframe en el panel de admin
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-8">
                <div className="bg-white/95 p-8 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="h-8 w-8 text-rose-600" />
                    <h3 className="text-2xl md:text-3xl font-bold text-rose-800">
                      {weddingConfig.receptionLocation}
                    </h3>
                  </div>
                  <p className="text-rose-700 text-lg mb-6">
                    {weddingConfig.receptionAddress}
                  </p>
                  <div className="flex items-center gap-3 text-rose-600">
                    <Clock className="h-6 w-6" />
                    <p className="text-lg">19:00 hrs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Confirmación */}
        <div
          ref={confirmationRef}
          className="min-h-screen flex items-center justify-center px-4"
        >
          <div className="max-w-md w-full">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-rose-200">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Heart className="h-12 w-12 text-rose-500" />
                </div>
                <CardTitle className="text-2xl md:text-3xl text-rose-800">
                  Confirma tu Asistencia
                </CardTitle>
                <CardDescription className="text-rose-600">
                  {!showConfirmation
                    ? "Ingresa tu número de invitado y código"
                    : "Confirma tu asistencia"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {!showConfirmation ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="guestNumber">Número de Invitado</Label>
                      <Input
                        id="guestNumber"
                        type="number"
                        placeholder="1234"
                        value={guestNumber}
                        onChange={(e) => setGuestNumber(e.target.value)}
                        className="text-center text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Código</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="ABC123"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className="uppercase text-center text-lg"
                      />
                    </div>
                    <Button
                      onClick={validateGuest}
                      disabled={loading || !guestNumber || !code}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-lg py-6"
                    >
                      {loading ? "Validando..." : "Continuar"}
                    </Button>
                  </div>
                ) : submitted ? (
                  <div className="text-center space-y-6">
                    <div className="p-6 bg-green-50 rounded-lg">
                      <Heart className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-green-700 text-lg">
                        ¡Gracias por confirmar tu asistencia, {guest?.name}!
                      </p>
                    </div>
                    <p className="text-rose-700 text-lg">
                      {guest?.attending
                        ? `Te esperamos el día de la boda (${guest?.guestCount} ${guest?.guestCount === 1 ? "persona" : "personas"})`
                        : "Lamentamos que no puedas acompañarnos"}
                    </p>
                    <div className="flex justify-center gap-4">
                      <Sparkles className="h-6 w-6 text-rose-400" />
                      <Heart className="h-6 w-6 text-rose-500" />
                      <Sparkles className="h-6 w-6 text-rose-400" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 bg-rose-50 rounded-lg">
                      <p className="text-rose-800 font-medium text-lg">
                        ¡Hola {guest?.name}!
                      </p>
                      <p className="text-rose-600">
                        Nos encantaría que nos acompañes en nuestro día especial
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-lg">¿Podrás acompañarnos?</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={attending ? "default" : "outline"}
                            onClick={() => setAttending(true)}
                            className="flex-1 py-4"
                          >
                            ¡Sí, asistiré!
                          </Button>
                          <Button
                            type="button"
                            variant={!attending ? "default" : "outline"}
                            onClick={() => setAttending(false)}
                            className="flex-1 py-4"
                          >
                            No podré asistir
                          </Button>
                        </div>
                      </div>

                      {attending && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label
                              htmlFor="guestCount"
                              className="flex items-center gap-2"
                            >
                              <Users className="h-4 w-4" />
                              Número de acompañantes (incluido tú)
                            </Label>
                            <Input
                              id="guestCount"
                              type="number"
                              min="1"
                              max="2"
                              value={guestCount}
                              onChange={(e) =>
                                setGuestCount(
                                  Math.min(2, parseInt(e.target.value))
                                )
                              }
                              className="text-center text-lg"
                            />
                            <p className="text-xs text-rose-500">
                              Máximo 2 personas por invitación
                            </p>
                          </div>
                        </motion.div>
                      )}

                      <div className="space-y-2">
                        <Label
                          htmlFor="comments"
                          className="flex items-center gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          Mensaje especial para los novios
                        </Label>
                        <Input
                          id="comments"
                          placeholder="Felicidades por su boda..."
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          className="text-lg"
                        />
                      </div>

                      <Button
                        onClick={submitRSVP}
                        disabled={loading}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-lg py-6"
                      >
                        {loading ? "Enviando..." : "Confirmar Respuesta"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
