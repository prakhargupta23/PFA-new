import React, { useState, useEffect } from "react";
import { 
  Box, 
  Grid, 
  Button, 
  TextField, 
  Paper, 
  Typography,
  IconButton,
  Card,
  CardContent,
  Divider,
  Container,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Chip
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HistoryIcon from "@mui/icons-material/History";
import DescriptionIcon from "@mui/icons-material/Description";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

interface Message {
  id: number;
  text: string;
  timestamp: Date;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ height: "100%" }}
    >
      {value === index && <Box sx={{ py: 2, height: "100%" }}>{children}</Box>}
    </div>
  );
}

export default function Finance() {
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [leftTabValue, setLeftTabValue] = useState<number>(0);
  const [rightTabValue, setRightTabValue] = useState<number>(0);

  // Persistence code
  useEffect(() => {
    const saved = localStorage.getItem("financeMessages");
    if (saved) {
      const parsedMessages = JSON.parse(saved);
      const messagesWithDates = parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(messagesWithDates);
      
      if (parsedMessages.length > 0) {
        const maxId = Math.max(...parsedMessages.map((msg: any) => msg.id));
        setNextId(maxId + 1);
      }
    }
  }, []);
  
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("financeMessages", JSON.stringify(messages));
    } else {
      localStorage.removeItem("financeMessages");
    }
  }, [messages]);

  const handleSubmit = () => {
    if (inputText.trim() === "") return;
    
    const newMessage: Message = {
      id: nextId,
      text: inputText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [newMessage, ...prev]);
    setInputText("");
    setNextId(prev => prev + 1);
  };

  const handleDelete = (id: number) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: "#1976d2" }}>
        Finance Portal Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ color: "text.secondary", mb: 3 }}>
        Multi-tab interface for messaging, AI history, and document management
      </Typography>

      <Grid container spacing={3}>
        {/* LEFT HALF - Two Tabs */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ height: "70vh", display: "flex", flexDirection: "column" }}>
            <AppBar position="static" color="default" elevation={1}>
              <Tabs 
                value={leftTabValue} 
                onChange={(e, newValue) => setLeftTabValue(newValue)}
                aria-label="left section tabs"
                sx={{ 
                  "& .MuiTab-root": { fontWeight: 600, minHeight: 48 },
                  "& .Mui-selected": { color: "#1976d2" }
                }}
              >
                <Tab 
                  icon={<ChatBubbleIcon />} 
                  iconPosition="start" 
                  label="Message Board" 
                  id="left-tab-0"
                  aria-controls="left-tabpanel-0"
                />
                <Tab 
                  icon={<HistoryIcon />} 
                  iconPosition="start" 
                  label="AI History" 
                  id="left-tab-1"
                  aria-controls="left-tabpanel-1"
                />
              </Tabs>
            </AppBar>

            {/* Message Board Tab (Left Tab 0) */}
            <TabPanel value={leftTabValue} index={0}>
              <Box sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
                overflow: "hidden"
              }}>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  mb: 2,
                  flexShrink: 0,
                  px: 2
                }}>
                  <FormatQuoteIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" component="h2" noWrap>
                    Message History
                  </Typography>
                  <Chip 
                    label={`${messages.length} messages`} 
                    size="small" 
                    sx={{ 
                      ml: "auto", 
                      bgcolor: "primary.light", 
                      color: "white",
                      flexShrink: 0
                    }}
                  />
                </Box>
                
                <Divider sx={{ flexShrink: 0 }} />
                
                <Box sx={{ 
                  flex: 1,
                  overflow: "auto",
                  p: 2,
                  mt: 1
                }}>
                  {messages.length === 0 ? (
                    <Box sx={{ 
                      textAlign: "center", 
                      py: 8, 
                      color: "text.secondary",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                      <FormatQuoteIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
                      <Typography variant="body1">
                        No messages yet. Start typing on the right!
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ pb: 1 }}>
                      {messages.map((message) => (
                        <Card 
                          key={message.id} 
                          variant="outlined" 
                          sx={{ 
                            mb: 2, 
                            "&:hover": { boxShadow: 2 },
                            width: "100%",
                            overflow: "visible"
                          }}
                        >
                          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <Box sx={{ 
                              display: "flex", 
                              justifyContent: "space-between", 
                              mb: 1,
                              flexWrap: "wrap",
                              gap: 1
                            }}>
                              <Typography variant="caption" color="text.secondary" noWrap>
                                Message #{message.id}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {formatTime(message.timestamp)}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                                maxHeight: "200px",
                                overflow: "auto",
                                mb: 1,
                                pr: 1
                              }}
                            >
                              {message.text}
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(message.id)}
                                aria-label="delete message"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </TabPanel>

            {/* AI History Tab (Left Tab 1) */}
            <TabPanel value={leftTabValue} index={1}>
              <Box sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
                overflow: "hidden"
              }}>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  mb: 3,
                  flexShrink: 0,
                  px: 2
                }}>
                  <HistoryIcon sx={{ mr: 1, color: "secondary.main" }} />
                  <Typography variant="h6" component="h2" noWrap>
                    AI Conversation History
                  </Typography>
                  <Chip 
                    label="Coming Soon" 
                    size="small" 
                    color="secondary" 
                    sx={{ ml: "auto", flexShrink: 0 }}
                  />
                </Box>
                
                <Divider sx={{ flexShrink: 0 }} />
                
                <Box sx={{ 
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  px: 2,
                  py: 2
                }}>
                  <HistoryIcon sx={{ fontSize: 64, opacity: 0.2, mb: 3 }} />
                  <Typography variant="h6" gutterBottom align="center">
                    AI History Section
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ maxWidth: "80%", mb: 2 }}>
                    This tab will display your previous AI conversations, queries, and analysis.
                  </Typography>
                  <Typography variant="caption" color="text.disabled" align="center">
                    Configure AI integration to start seeing your history here.
                  </Typography>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>

        {/* RIGHT HALF - Two Tabs */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ height: "70vh", display: "flex", flexDirection: "column" }}>
            <AppBar position="static" color="default" elevation={1}>
              <Tabs 
                value={rightTabValue} 
                onChange={(e, newValue) => setRightTabValue(newValue)}
                aria-label="right section tabs"
                sx={{ 
                  "& .MuiTab-root": { fontWeight: 600, minHeight: 48 },
                  "& .Mui-selected": { color: "#1976d2" }
                }}
              >
                <Tab 
                  icon={<SendIcon />} 
                  iconPosition="start" 
                  label="Message Editor" 
                  id="right-tab-0"
                  aria-controls="right-tabpanel-0"
                />
                <Tab 
                  icon={<DescriptionIcon />} 
                  iconPosition="start" 
                  label="Document View" 
                  id="right-tab-1"
                  aria-controls="right-tabpanel-1"
                />
              </Tabs>
            </AppBar>

            {/* Message Editor Tab (Right Tab 0) */}
            <TabPanel value={rightTabValue} index={0}>
              <Box sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
                overflow: "hidden",
                p: 2
              }}>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column",
                  height: "100%"
                }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center",
                      mb: 2
                    }}
                  >
                    <SendIcon sx={{ mr: 1, color: "primary.main" }} />
                    Compose New Message
                  </Typography>
                  
                  <Box sx={{ 
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0
                  }}>
                    <TextField
                      fullWidth
                      multiline
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message here... You can use Shift+Enter for new lines, or just Enter to submit."
                      variant="outlined"
                      sx={{ 
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          height: "100%",
                          alignItems: "flex-start",
                        }
                      }}
                      inputProps={{
                        maxLength: 1000
                      }}
                      InputProps={{
                        sx: {
                          height: "100%",
                          "& textarea": {
                            resize: "none"
                          }
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider"
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      Character count: {inputText.length}/1000
                    </Typography>
                    
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handleSubmit}
                      disabled={inputText.trim() === ""}
                      sx={{ px: 4 }}
                    >
                      Submit Message
                    </Button>
                  </Box>
                </Box>
              </Box>
            </TabPanel>

            {/* Document View Tab (Right Tab 1) */}
            <TabPanel value={rightTabValue} index={1}>
              <Box sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
                overflow: "hidden"
              }}>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  mb: 3,
                  flexShrink: 0,
                  px: 2
                }}>
                  <DescriptionIcon sx={{ mr: 1, color: "secondary.main" }} />
                  <Typography variant="h6" component="h2" noWrap>
                    Document Viewer
                  </Typography>
                  <Chip 
                    label="Empty" 
                    size="small" 
                    color="secondary" 
                    sx={{ ml: "auto", flexShrink: 0 }}
                  />
                </Box>
                
                <Divider sx={{ flexShrink: 0 }} />
                
                <Box sx={{ 
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  px: 2,
                  py: 2
                }}>
                  <DescriptionIcon sx={{ fontSize: 64, opacity: 0.2, mb: 3 }} />
                  <Typography variant="h6" gutterBottom align="center">
                    Document View Section
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ maxWidth: "80%", mb: 2 }}>
                    This tab will display uploaded documents, PDFs, or other financial reports for analysis.
                  </Typography>
                  <Typography variant="caption" color="text.disabled" align="center">
                    Upload documents to view them here.
                  </Typography>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer Stats */}
      <Box sx={{ 
        mt: 3, 
        display: "flex", 
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1
      }}>
        <Typography variant="caption" color="text.secondary">
          Total Messages: {messages.length} • Last Updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Container>
  );
}