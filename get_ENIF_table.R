library(dplyr)
library(dbplyr)
library(here)
library(tidyverse)
library(readxl)
library(jsonlite)

#Read the data
ENIF18_df1<-read_excel(path=here('Data','tmodulo.xlsx'),sheet = 'tmodulo'
                       ,range=cell_rows(1:12447)
                       ,col_names = TRUE
                       ,col_types=c(rep("text",221), rep("numeric", 1)))

ENIF18_df2<-read_excel(path=here('Data','tmodulo2.xlsx'),sheet = 'tmodulo2'
                       ,range=cell_rows(1:12447)
                       ,col_names = TRUE
                       ,col_types=c(rep("text",148), rep("numeric", 1)))

ENIF18_dftot<-inner_join(ENIF18_df1,ENIF18_df2,by=c("UPM","VIV_SEL","HOGAR","N_REN"))

#Preparing data to get the summary table:
#Gender variable: GEN
#1: Male, 2: Female
ENIF18_dftot$GEN<-as.numeric(ENIF18_dftot$SEXO.x)

#Location variable: SIZE
#1: more than 15,000 inhabitants, 2: less than 15,000 inhabitants
ENIF18_dftot$SIZE<-1
ENIF18_dftot$SIZE[ENIF18_dftot$TLOC.x==2]<-1 
ENIF18_dftot$SIZE[ENIF18_dftot$TLOC.x==3]<-2 
ENIF18_dftot$SIZE[ENIF18_dftot$TLOC.x==4]<-2

#Region Variable: REGION
# 1: Northwest, 2: Northeast, 3:Central West, 4: Mexico City, 5: Central East, 6: South
ENIF18_dftot$REGION<-as.numeric(ENIF18_dftot$REGION.x)

#Education Variable: EDUC
#1: None, 2: Elementary School, 3: Middle School, 4: High School, 5: Undergradute School, 6: Graduate School  
ENIF18_dftot$EDUC<-1
ENIF18_dftot$EDUC[ENIF18_dftot$NIV=="01"|ENIF18_dftot$NIV=="02"]<-2
ENIF18_dftot$EDUC[ENIF18_dftot$NIV=="03"|ENIF18_dftot$NIV=="04"]<-3
ENIF18_dftot$EDUC[ENIF18_dftot$NIV=="05"|ENIF18_dftot$NIV=="06"|ENIF18_dftot$NIV=="07"]<-4
ENIF18_dftot$EDUC[ENIF18_dftot$NIV=="08"]<-5
ENIF18_dftot$EDUC[ENIF18_dftot$NIV=="09"]<-6

#Age Variable: AGE
#1:18-25, 2:26-30, 3:31-35, 4:36-40, 5:41-45, 6:46-50, 7:51-55, 8:56-60, 9:61-65, 10:66-70
ENIF18_dftot$AGE<-1
ENIF18_dftot$AGE[ENIF18_dftot$EDAD.x>25 & ENIF18_dftot$EDAD.x<=30]<-2
ENIF18_dftot$AGE[ENIF18_dftot$EDAD.x>30 & ENIF18_dftot$EDAD.x<=35]<-3
ENIF18_dftot$AGE[ENIF18_dftot$EDAD.x>35 & ENIF18_dftot$EDAD.x<=40]<-4
ENIF18_dftot$AGE[ENIF18_dftot$EDAD.x>40 & ENIF18_dftot$EDAD.x<=45]<-5
ENIF18_dftot$AGE[ENIF18_dftot$EDAD.x>45 & ENIF18_dftot$EDAD.x<=50]<-6
ENIF18_dftot$AGE[ENIF18_dftot$EDAD.x>50 & ENIF18_dftot$EDAD.x<=55]<-7
ENIF18_dftot$AGE[ENIF18_dftot$EDAD.x>55 & ENIF18_dftot$EDAD.x<=60]<-8
ENIF18_dftot$AGE[ENIF18_dftot$EDAD.x>60 & ENIF18_dftot$EDAD.x<=65]<-9
ENIF18_dftot$AGE[ENIF18_dftot$EDAD.x>65 & ENIF18_dftot$EDAD.x<=70]<-10

#Occupation Variable: OCCUP
#1:Employee, 2:Student, 3:Retiree , 4:Homecare, 5:Unemployed
ENIF18_dftot$OCCUP<-5
ENIF18_dftot$OCCUP[ENIF18_dftot$P3_5<=2]<-1
ENIF18_dftot$OCCUP[ENIF18_dftot$P3_5==4]<-2
ENIF18_dftot$OCCUP[ENIF18_dftot$P3_5==6]<-3
ENIF18_dftot$OCCUP[ENIF18_dftot$P3_5==5]<-4

#Deposit accounts ownership: deposits
#1: True, 0: False
ENIF18_dftot$deposits<-0
ENIF18_dftot$deposits[ENIF18_dftot$P5_4=='1' | ENIF18_dftot$P5_5=='1']<-1

#Credit holding: credit
#1: True, 0: False
ENIF18_dftot$credit<-0
ENIF18_dftot$credit[ENIF18_dftot$P6_3=='1' | ENIF18_dftot$P6_4=='1']<-1

#Insurance holding: insurance
#1: True, 0: False
ENIF18_dftot$insurance<-0
ENIF18_dftot$insurance[ENIF18_dftot$P8_1=='1' | ENIF18_dftot$P8_2=='1']<-1

#Retirement accounts ownership: retirement
#1: True, 0: False
ENIF18_dftot$retirement<-0
ENIF18_dftot$retirement[ENIF18_dftot$P9_1=='1']<-1

#Person weight: PWT
ENIF18_dftot$PWT<-ENIF18_dftot$FAC_PER.x

ENIF18_dftot<-ENIF18_dftot %>%
  select("GEN","SIZE","REGION","EDUC","AGE","OCCUP","deposits","credit","insurance","retirement", "PWT")

#write.csv(ENIF18_dftot,file="ENIF2018.csv",row.names = FALSE)
#write(toJSON(ENIF18_dftot,pretty = TRUE),"ENIF2018.json")
