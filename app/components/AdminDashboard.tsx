"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeddingConfig from "./WeddingConfig";
import {
  Users,
  UserCheck,
  Calendar,
  Download,
  Plus,
  FileText,
  Upload,
  Trash2,
  Edit,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";

interface Guest {
  id: string;
  name: string;
  guestNumber: number;
  code: string;
  hasResponded: boolean;
  attending: boolean;
  guestCount: number;
  dietaryRestrictions?: string;
  comments?: string;
  createdAt: string;
  respondedAt?: string;
}

interface Stats {
  totalGuests: number;
  respondedGuests: number;
  attendingGuests: number;
  totalAttendees: number;
  responseRate: number;
}

export default function AdminDashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newGuestName, setNewGuestName] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);

  useEffect(() => {
    fetchGuests();
    fetchStats();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/guests");
      const data = await response.json();
      setGuests(data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const addGuest = async () => {
    if (!newGuestName.trim()) return;

    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newGuestName }),
      });

      if (response.ok) {
        setNewGuestName("");
        fetchGuests();
        fetchStats();
      }
    } catch (error) {
      console.error("Error adding guest:", error);
    }
  };

  const deleteGuest = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este invitado?")) return;

    try {
      const response = await fetch(`/api/guests/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchGuests();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting guest:", error);
    }
  };

  const copyGuestInfo = async (guest: Guest) => {
    const message = `🎉 ¡Invitación de boda! 💍\n\nHola ${guest.name}!\n\nTe invitamos a nuestra boda. Para confirmar tu asistencia, usa estos datos:\n\n📋 Número de invitado: ${guest.guestNumber}\n🔑 Código: ${guest.code}\n\nIngresa a [URL de tu invitación] para confirmar.\n\n¡Esperamos verte en nuestro día especial! 💕`;

    try {
      await navigator.clipboard.writeText(message);
      setCopiedGuestId(guest.id);
      setTimeout(() => setCopiedGuestId(null), 2000);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
    }
  };

  const copyGuestData = async (guest: Guest) => {
    const data = `${guest.name} - #${guest.guestNumber} - ${guest.code}`;

    try {
      await navigator.clipboard.writeText(data);
      setCopiedGuestId(guest.id);
      setTimeout(() => setCopiedGuestId(null), 2000);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;

    const text = await csvFile.text();

    try {
      const response = await fetch("/api/guests/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csvData: text }),
      });

      if (response.ok) {
        setCsvFile(null);
        fetchGuests();
        fetchStats();
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Guest Number",
      "Code",
      "Responded",
      "Attending",
      "Guest Count",
      "Dietary Restrictions",
      "Comments",
    ];
    const csvContent = [
      headers.join(","),
      ...guests.map((guest) =>
        [
          `"${guest.name}"`,
          guest.guestNumber,
          guest.code,
          guest.hasResponded,
          guest.attending,
          guest.guestCount,
          `"${guest.dietaryRestrictions || ""}"`,
          `"${guest.comments || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-guests.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 p-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Panel de Administración
          </h1>
          <p className="text-slate-600">
            Gestiona las invitaciones y confirmaciones de tu boda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invitados
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalGuests || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Respondieron
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.respondedGuests || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.responseRate.toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmarán</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.attendingGuests || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Asistentes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalAttendees || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="guests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="guests">Invitados</TabsTrigger>
            <TabsTrigger value="add">Agregar</TabsTrigger>
            <TabsTrigger value="bulk">Carga Masiva</TabsTrigger>
            <TabsTrigger value="config">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="guests" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lista de Invitados</h2>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>

            <div className="grid gap-4">
              {guests.map((guest) => (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{guest.name}</h3>
                            <Badge variant="outline">
                              #{guest.guestNumber}
                            </Badge>
                            <Badge variant="secondary">{guest.code}</Badge>
                            {guest.hasResponded && (
                              <Badge
                                variant={
                                  guest.attending ? "default" : "secondary"
                                }
                              >
                                {guest.attending ? "Asistirá" : "No asistirá"}
                              </Badge>
                            )}
                          </div>

                          {guest.hasResponded && (
                            <div className="space-y-1 text-sm text-slate-600">
                              {guest.attending && (
                                <p>Acompañantes: {guest.guestCount}</p>
                              )}
                              {guest.dietaryRestrictions && (
                                <p>
                                  Restricciones: {guest.dietaryRestrictions}
                                </p>
                              )}
                              {guest.comments && (
                                <p>Comentarios: {guest.comments}</p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyGuestInfo(guest)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            {copiedGuestId === guest.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <MessageCircle className="h-4 w-4" />
                            )}
                            WhatsApp
                          </Button>

                          <Button
                            onClick={() => copyGuestData(guest)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            {copiedGuestId === guest.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            Copiar
                          </Button>

                          <Button
                            onClick={() => deleteGuest(guest.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agregar Invitado</CardTitle>
                <CardDescription>
                  Agrega un nuevo invitado. Se generará automáticamente un
                  número y código únicos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nombre del invitado"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addGuest()}
                  />
                  <Button onClick={addGuest} disabled={!newGuestName.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Carga Masiva</CardTitle>
                <CardDescription>
                  Sube un archivo CSV con la lista de invitados. Formato:
                  name,code (opcional),guestNumber (opcional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  />
                  <Button onClick={handleCsvUpload} disabled={!csvFile}>
                    <Upload className="h-4 w-4 mr-2" />
                    Cargar
                  </Button>
                </div>

                <div className="p-4 bg-slate-100 rounded-lg">
                  <h4 className="font-medium mb-2">Formato CSV:</h4>
                  <pre className="text-sm text-slate-600">
                    name,code,guestNumber{"\n"}
                    Juan Pérez,ABC123,1001{"\n"}
                    María García,,{"\n"}
                    Carlos López,XYZ789,1003
                  </pre>
                  <p className="text-xs text-slate-500 mt-2">
                    Si no especificas un código o número, se generarán
                    automáticamente
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <WeddingConfig />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
