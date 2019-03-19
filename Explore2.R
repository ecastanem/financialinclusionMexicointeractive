library(here)
library(tidyverse)
library(readxl)
library(dbplyr)
library(dplyr)
library(directlabels)
library(ggridges)
library(treemapify)
library(gridExtra)
library(grid)
library(viridis)
library(haven)
library(rgdal)
library(sf)
library(broom)
library(jsonlite)


#Read the World Bank Global Findex data and the GDP per capita from the World Development Indicators data: 
WB_GFdata<-read_excel(path=here('Data','FINDEXEXCEL.xlsx'),sheet = 'Data'
                      ,range=cell_rows(1:142009)
                      ,col_names = TRUE
                      ,col_types=c(rep("text",4), rep("numeric", 3)))

WB_WDdata<-read_excel(path=here('Data','WDIEXCEL.xlsx'),sheet = 'Data2'
                      ,range=cell_rows(1:265)
                      ,col_names = TRUE
                      ,col_types=c(rep("text",4), rep("numeric", 58)))

indicators <- c("account.t.d", "fin7.t.a", "fin2.t.a","g20.t","mobileaccount.t.d","fin19.t.a","fin14abca.t.d","fing2p.t.d","fin37.t.a","fin46.a","fin32.t.a","fin18.t.d","fin26.28.t.a")

regions <- c('CAM','SAM','ARB','EAS','EAP','EMU','ECS','ECA','HIC','LCN','LAC','LMY','LIC','LMC','MEA','MNA','MIC','NAC','OED','SAS','SSF','SSA','UMC','WLD','CSS','CEB','EAR','TEA','TEC','EUU','FCS','HPC','IBD','IBT','IDB','IDX','IDA','LTE','TLA','LDC','TMN','INX','OSS','PSS','PST','PRE','SST','TSA','TSS')

aux_GFdata <- WB_GFdata %>% 
  filter(`Indicator Code` %in% indicators, !is.na(`2011`),!is.na(`2014`),!is.na(`2017`),!(`Country Code` %in% regions))

aux_GFdata <- WB_GFdata %>% 
  select(c("Country Name", "Country Code","Indicator Code","2017")) %>%
  filter(`Indicator Code` %in% indicators, !is.na(`2017`),!(`Country Code` %in% regions))

aux_GDPpc<-WB_WDdata %>%
  select(c("Country Name", "Country Code","Indicator Code","2017")) %>%
  filter(!is.na(`2017`),!(`Country Code` %in% regions))

aux_data <- rbind(aux_GFdata,aux_GDPpc)
aux_data <- aux_data %>% dplyr::arrange(`Country Code`,`Indicator Code`)

a <- data.frame(cbind(names(table(aux_data$`Country Code`)),table(aux_data$`Country Code`)==14))
a <- a[a$X2==TRUE,]

aux_data <-  aux_data %>% 
  filter(`Country Code` %in% a$X1)

write(toJSON(aux_data,pretty = TRUE),"WB2017.json")