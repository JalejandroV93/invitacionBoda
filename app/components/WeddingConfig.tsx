"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save,  MapPin, Heart, Calendar, Image } from "lucide-react";

interface WeddingConfig {
  id: string;
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

export default function WeddingConfig() {
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/wedding-config");
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/wedding-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setMessage("Configuración guardada exitosamente");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error saving config:", error);
      setMessage("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof WeddingConfig,
    value: string | number
  ) => {
    if (!config) return;

    setConfig({
      ...config,
      [field]: value,
    });
  };

  const handleImageUpload = (field: keyof WeddingConfig, file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        handleInputChange(field, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Error cargando la configuración</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Configuración de la Boda
        </h2>
        <Button onClick={saveConfig} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
        >
          {message}
        </div>
      )}

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ceremony">Ceremonia</TabsTrigger>
          <TabsTrigger value="reception">Recepción</TabsTrigger>
          <TabsTrigger value="images">Imágenes</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Información General
              </CardTitle>
              <CardDescription>
                Configura los detalles básicos de tu boda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brideName">Nombre de la Novia</Label>
                  <Input
                    id="brideName"
                    value={config.brideName}
                    onChange={(e) =>
                      handleInputChange("brideName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomName">Nombre del Novio</Label>
                  <Input
                    id="groomName"
                    value={config.groomName}
                    onChange={(e) =>
                      handleInputChange("groomName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weddingDate">Fecha de la Boda</Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={config.weddingDate.split("T")[0]}
                  onChange={(e) =>
                    handleInputChange("weddingDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Mensaje de Bienvenida</Label>
                <Textarea
                  id="welcomeMessage"
                  value={config.welcomeMessage}
                  onChange={(e) =>
                    handleInputChange("welcomeMessage", e.target.value)
                  }
                  placeholder="¡Nos casamos!"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ourStory">Nuestra Historia</Label>
                <Textarea
                  id="ourStory"
                  value={config.ourStory || ""}
                  onChange={(e) =>
                    handleInputChange("ourStory", e.target.value)
                  }
                  placeholder="Después de [años] juntos, hemos decidido dar el siguiente paso en nuestra historia de amor. Queremos compartir este momento especial contigo y con todos nuestros seres queridos."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ceremony" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Ceremonia
              </CardTitle>
              <CardDescription>
                Configura los detalles de la ceremonia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ceremonyLocation">Lugar de la Ceremonia</Label>
                <Input
                  id="ceremonyLocation"
                  value={config.ceremonyLocation}
                  onChange={(e) =>
                    handleInputChange("ceremonyLocation", e.target.value)
                  }
                  placeholder="Iglesia San José"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ceremonyAddress">
                  Dirección de la Ceremonia
                </Label>
                <Input
                  id="ceremonyAddress"
                  value={config.ceremonyAddress}
                  onChange={(e) =>
                    handleInputChange("ceremonyAddress", e.target.value)
                  }
                  placeholder="Calle Principal 123, Ciudad"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ceremonyMapIframe">Iframe de Google Maps</Label>
                <Textarea
                  id="ceremonyMapIframe"
                  value={config.ceremonyMapIframe || ""}
                  onChange={(e) =>
                    handleInputChange("ceremonyMapIframe", e.target.value)
                  }
                  placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                  rows={4}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  📍 Cómo obtener el iframe de Google Maps:
                </h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>
                    1. Ve a{" "}
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      className="underline"
                    >
                      Google Maps
                    </a>
                  </li>
                  <li>2. Busca la ubicación de la ceremonia</li>
                  <li>3. Haz clic en Compartir → Insertar un mapa</li>
                  <li>4. Copia el código iframe completo</li>
                  <li>5. Pégalo en el campo de arriba</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reception" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Recepción
              </CardTitle>
              <CardDescription>
                Configura los detalles de la recepción
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receptionLocation">Lugar de la Recepción</Label>
                <Input
                  id="receptionLocation"
                  value={config.receptionLocation}
                  onChange={(e) =>
                    handleInputChange("receptionLocation", e.target.value)
                  }
                  placeholder="Salón de Fiestas El Jardín"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receptionAddress">
                  Dirección de la Recepción
                </Label>
                <Input
                  id="receptionAddress"
                  value={config.receptionAddress}
                  onChange={(e) =>
                    handleInputChange("receptionAddress", e.target.value)
                  }
                  placeholder="Avenida Central 456, Ciudad"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receptionMapIframe">
                  Iframe de Google Maps
                </Label>
                <Textarea
                  id="receptionMapIframe"
                  value={config.receptionMapIframe || ""}
                  onChange={(e) =>
                    handleInputChange("receptionMapIframe", e.target.value)
                  }
                  placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                  rows={4}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  📍 Cómo obtener el iframe de Google Maps:
                </h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>
                    1. Ve a{" "}
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      className="underline"
                    >
                      Google Maps
                    </a>
                  </li>
                  <li>2. Busca la ubicación de la recepción</li>
                  <li>3. Haz clic en Compartir → Insertar un mapa</li>
                  <li>4. Copia el código iframe completo</li>
                  <li>5. Pégalo en el campo de arriba</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Imágenes
              </CardTitle>
              <CardDescription>
                Sube las imágenes que aparecerán en la invitación (se guardan
                automáticamente en la base de datos)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="backgroundImage"
                    className="flex items-center justify-between"
                  >
                    <span>Imagen de Fondo</span>
                    <span className="text-xs text-gray-500">
                      Recomendado: 1920x1080px
                    </span>
                  </Label>
                  <Input
                    id="backgroundImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload("backgroundImage", file);
                    }}
                  />
                  {config.backgroundImage && (
                    <div className="mt-2">
                      <img
                        src={config.backgroundImage}
                        alt="Fondo"
                        className="w-32 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="brideImage"
                    className="flex items-center justify-between"
                  >
                    <span>Imagen de la Novia</span>
                    <span className="text-xs text-gray-500">
                      Recomendado: 800x800px
                    </span>
                  </Label>
                  <Input
                    id="brideImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload("brideImage", file);
                    }}
                  />
                  {config.brideImage && (
                    <div className="mt-2">
                      <img
                        src={config.brideImage}
                        alt="Novia"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="groomImage"
                    className="flex items-center justify-between"
                  >
                    <span>Imagen del Novio</span>
                    <span className="text-xs text-gray-500">
                      Recomendado: 800x800px
                    </span>
                  </Label>
                  <Input
                    id="groomImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload("groomImage", file);
                    }}
                  />
                  {config.groomImage && (
                    <div className="mt-2">
                      <img
                        src={config.groomImage}
                        alt="Novio"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="coupleImage"
                    className="flex items-center justify-between"
                  >
                    <span>Imagen de la Pareja</span>
                    <span className="text-xs text-gray-500">
                      Recomendado: 1200x800px
                    </span>
                  </Label>
                  <Input
                    id="coupleImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload("coupleImage", file);
                    }}
                  />
                  {config.coupleImage && (
                    <div className="mt-2">
                      <img
                        src={config.coupleImage}
                        alt="Pareja"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">
                  💡 Información sobre las imágenes:
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>
                    • Las imágenes se guardan automáticamente en base64 en la
                    base de datos
                  </li>
                  <li>
                    • Se recomienda usar imágenes optimizadas (JPG/PNG) para
                    mejor rendimiento
                  </li>
                  <li>
                    • Los tamaños recomendados aseguran la mejor calidad visual
                  </li>
                  <li>
                    • Las imágenes se redimensionan automáticamente para
                    adaptarse al diseño
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
