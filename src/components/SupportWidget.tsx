import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Plus, AlertCircle, Clock, CheckCircle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
}

export const SupportWidget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  const fetchTickets = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    if (!user || !newTicket.title || !newTicket.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          title: newTicket.title,
          description: newTicket.description,
          priority: newTicket.priority
        })
        .select()
        .single();

      if (error) throw error;

      // Add initial message
      await supabase
        .from('support_messages')
        .insert({
          ticket_id: data.id,
          user_id: user.id,
          message: newTicket.description,
          is_admin: false
        });

      setNewTicket({ title: '', description: '', priority: 'medium' });
      setIsCreating(false);
      fetchTickets();

      toast({
        title: "Ticket Created",
        description: "Your support request has been submitted successfully."
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user && isOpen) {
      fetchTickets();
    }
  }, [user, isOpen]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed': return <X className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Support Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Support Center</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Create Ticket Button */}
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Support Ticket
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Support Ticket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ticket-title">Title</Label>
                    <Input
                      id="ticket-title"
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticket-priority">Priority</Label>
                    <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ticket-description">Description</Label>
                    <Textarea
                      id="ticket-description"
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      placeholder="Detailed description of your issue"
                      rows={4}
                    />
                  </div>
                  <Button onClick={createTicket} className="w-full">
                    Submit Ticket
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Recent Tickets */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Recent Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading your tickets...</div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No support tickets yet. Create one if you need help!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{ticket.title}</h4>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(ticket.status)}
                            <Badge className={`text-white text-xs ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {ticket.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                          </span>
                          <Badge variant="outline" className="flex items-center gap-1 text-xs">
                            {getStatusIcon(ticket.status)}
                            {ticket.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Direct Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <strong>Phone:</strong> 07040294858
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> princejuniorokpo@gmail.com
                </p>
                <p className="text-sm text-muted-foreground">
                  For urgent matters, please call or send a WhatsApp message.
                </p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};