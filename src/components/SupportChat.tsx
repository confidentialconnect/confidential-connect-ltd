import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Plus, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export const SupportChat = () => {
  const { user, profile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTickets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createTicket = async () => {
    if (!user || !newTicket.title || !newTicket.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
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

      // Create initial message
      await supabase
        .from('support_messages')
        .insert({
          ticket_id: data.id,
          user_id: user.id,
          message: newTicket.description,
          is_admin: false
        });

      setNewTicket({ title: '', description: '', priority: 'medium' });
      setIsCreatingTicket(false);
      fetchTickets();
      
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created successfully."
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!selectedTicket || !user || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: selectedTicket.id,
          user_id: user.id,
          message: newMessage.trim(),
          is_admin: isAdmin
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedTicket.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status })
        .eq('id', ticketId);

      if (error) throw error;

      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status });
      }

      toast({
        title: "Status Updated",
        description: `Ticket status updated to ${status}`
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);

      // Set up real-time subscription for messages
      const channel = supabase
        .channel(`ticket-${selectedTicket.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'support_messages',
            filter: `ticket_id=eq.${selectedTicket.id}`
          },
          () => {
            fetchMessages(selectedTicket.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedTicket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Set up real-time subscription for tickets
    const channel = supabase
      .channel('support-tickets')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_tickets'
        },
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please sign in to access support</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
      {/* Tickets List */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Support Tickets</CardTitle>
          <Dialog open={isCreatingTicket} onOpenChange={setIsCreatingTicket}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="Detailed description of your issue"
                    rows={4}
                  />
                </div>
                <Button onClick={createTicket} className="w-full">
                  Create Ticket
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No tickets yet. Create your first support ticket!
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedTicket?.id === ticket.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm truncate">{ticket.title}</h4>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(ticket.status)}
                      <Badge className={`text-white text-xs ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{ticket.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2">
        {selectedTicket ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{selectedTicket.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getStatusIcon(selectedTicket.status)}
                    {selectedTicket.status}
                  </Badge>
                  <Badge className={`text-white ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </Badge>
                </div>
              </div>
              {isAdmin && (
                <Select value={selectedTicket.status} onValueChange={(value) => updateTicketStatus(selectedTicket.id, value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </CardHeader>
            <CardContent className="flex flex-col h-[450px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.is_admin
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.is_admin ? 'Support' : 'You'} • {' '}
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={selectedTicket.status === 'closed'}
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim() || selectedTicket.status === 'closed'}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Select a ticket to view conversation</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};