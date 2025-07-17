'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Heart, CheckCircle } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  code: string;
  hasResponded: boolean;
  attending: boolean;
  guestCount: number;
  dietaryRestrictions?: string;
  comments?: string;
}

export default function GuestForm() {
  const [code, setCode] = useState('');
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // RSVP form state
  const [attending, setAttending] = useState<boolean>(true);
  const [guestCount, setGuestCount] = useState(1);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [comments, setComments] = useState('');

  const validateCode = async () => {
    if (!code || code.length !== 4) {
      setError('Por favor ingresa un código válido de 4 dígitos');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/guest/validate?code=${code}`);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Código no válido');
        return;
      }
      
      setGuest(data);
      if (data.hasResponded) {
        setSubmitted(true);
      }
    } catch (err) {
      setError('Error al validar el código. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const submitRSVP = async () => {
    if (!guest) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/guest/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: guest.code,
          attending,
          guestCount: attending ? guestCount : 0,
          dietaryRestrictions,
          comments,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Error al enviar respuesta');
        return;
      }
      
      setSubmitted(true);
      setGuest(data);
    } catch (err) {
      setError('Error al enviar respuesta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            </motion.div>
            <CardTitle className="text-2xl text-rose-800">¡Confirmado!</CardTitle>
            <CardDescription>
              Gracias por confirmar tu asistencia, {guest?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-rose-50 rounded-lg">
              <p className="text-rose-700">
                {guest?.attending 
                  ? `¡Nos vemos en la boda! (${guest?.guestCount} ${guest?.guestCount === 1 ? 'persona' : 'personas'})`
                  : 'Lamentamos que no puedas acompañarnos'
                }
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Te esperamos el [fecha] a las [hora] en [lugar]
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Heart className="mx-auto h-12 w-12 text-rose-500 mb-4" />
          </motion.div>
          <CardTitle className="text-2xl text-rose-800">
            Invitación de Boda
          </CardTitle>
          <CardDescription>
            {!guest ? 'Ingresa tu código de invitación' : 'Confirma tu asistencia'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {!guest ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="code">Código de Invitación</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="1234"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="text-center text-lg tracking-wider"
                  maxLength={4}
                />
              </div>
              <Button
                onClick={validateCode}
                disabled={loading || code.length !== 4}
                className="w-full bg-rose-600 hover:bg-rose-700"
              >
                {loading ? 'Validando...' : 'Continuar'}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-rose-50 rounded-lg">
                <p className="text-rose-800 font-medium">¡Hola {guest.name}!</p>
                <p className="text-rose-600 text-sm">
                  Nos encantaría que nos acompañes en nuestro día especial
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>¿Podrás acompañarnos?</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={attending ? "default" : "outline"}
                      onClick={() => setAttending(true)}
                      className="flex-1"
                    >
                      ¡Sí, asistiré!
                    </Button>
                    <Button
                      type="button"
                      variant={!attending ? "default" : "outline"}
                      onClick={() => setAttending(false)}
                      className="flex-1"
                    >
                      No podré asistir
                    </Button>
                  </div>
                </div>

                {attending && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="guestCount">Número de acompañantes (incluido tú)</Label>
                      <Input
                        id="guestCount"
                        type="number"
                        min="1"
                        max="6"
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dietary">Restricciones alimentarias</Label>
                      <Input
                        id="dietary"
                        placeholder="Vegetariano, vegano, sin gluten, etc."
                        value={dietaryRestrictions}
                        onChange={(e) => setDietaryRestrictions(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="comments">Comentarios adicionales</Label>
                  <Input
                    id="comments"
                    placeholder="Mensaje especial para los novios..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                <Button
                  onClick={submitRSVP}
                  disabled={loading}
                  className="w-full bg-rose-600 hover:bg-rose-700"
                >
                  {loading ? 'Enviando...' : 'Confirmar Respuesta'}
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}