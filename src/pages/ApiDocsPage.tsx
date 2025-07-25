import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  Alert,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Key as KeyIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const ApiDocsPage = () => {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            API Anahtarları
          </Typography>
          <Typography color="text.secondary">
            DevSync API'sini kullanarak kendi uygulamalarınızı geliştirebilir ve otomasyonlar oluşturabilirsiniz.
          </Typography>
        </Box>

        <Alert 
          severity="info" 
          icon={<SecurityIcon />}
          sx={{ borderRadius: 2 }}
        >
          API anahtarlarınızı güvende tutun ve asla paylaşmayın. Anahtarlar tam yetkiye sahiptir ve tüm API işlemlerini gerçekleştirebilir.
        </Alert>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            API Anahtarı Ne İşe Yarar?
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                1. Otomatik Analizler
              </Typography>
              <Typography color="text.secondary">
                CI/CD pipeline'larınıza DevSync analizlerini entegre edebilirsiniz. Her commit veya pull request sonrası otomatik kod analizi yapılabilir.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                2. Özel Entegrasyonlar
              </Typography>
              <Typography color="text.secondary">
                Kendi araçlarınızı DevSync ile entegre edebilirsiniz. Örneğin, şirket içi araçlarınızdan kod analizi istekleri yapabilirsiniz.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                3. Veri Çekme
              </Typography>
              <Typography color="text.secondary">
                Analiz sonuçlarını, commit istatistiklerini ve diğer verileri programmatik olarak çekebilirsiniz. Bu verileri kendi raporlama sistemlerinizde kullanabilirsiniz.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            API Yetkileri
          </Typography>

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <CodeIcon color="primary" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">read</Typography>
                <Typography variant="body2" color="text.secondary">
                  Analiz sonuçlarını, commit verilerini ve repository bilgilerini okuma
                </Typography>
              </Box>
              <Chip label="Güvenli" size="small" color="success" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <CodeIcon color="primary" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">write</Typography>
                <Typography variant="body2" color="text.secondary">
                  Yeni analizler başlatma, repository ekleme ve webhook yapılandırması
                </Typography>
              </Box>
              <Chip label="Dikkatli Kullanın" size="small" color="warning" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <CodeIcon color="primary" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">admin</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tüm yönetimsel işlemler, kullanıcı yönetimi ve ayarlar
                </Typography>
              </Box>
              <Chip label="Yüksek Risk" size="small" color="error" />
            </Box>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Güvenlik Önerileri
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Environment Variables Kullanın"
                secondary="API anahtarlarını asla kodunuzda doğrudan yazmayın. Her zaman environment variables kullanın."
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Minimum Yetki Prensibi"
                secondary="Her servis için sadece ihtiyacı olan yetkileri içeren anahtarlar kullanın."
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="Düzenli Rotasyon"
                secondary="API anahtarlarınızı düzenli aralıklarla yenileyin ve eski anahtarları silin."
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Kullanım Takibi"
                secondary="API anahtarlarınızın kullanımını düzenli olarak kontrol edin ve şüpheli aktiviteleri izleyin."
              />
            </ListItem>
          </List>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Başlarken
          </Typography>

          <Stack spacing={2}>
            <Typography>
              1. Ayarlar sayfasından yeni bir API anahtarı oluşturun
            </Typography>
            <Typography>
              2. Anahtarınız için gerekli yetkileri seçin (read, write, admin)
            </Typography>
            <Typography>
              3. API dokümantasyonumuzu inceleyin ve istekleri yapmaya başlayın
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Link href="/docs/api" target="_blank" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CodeIcon fontSize="small" />
                API Dokümantasyonu
              </Link>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ApiDocsPage; 