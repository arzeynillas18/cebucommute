import { StyleSheet, Platform } from 'react-native';
import { Colors, FontSize, Spacing, Radius, Shadow } from './theme';

export default StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: Colors.bgPrimary,
  },

  // ── Header ──
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop:        Spacing.md,
    paddingBottom:     Spacing.md,
    backgroundColor:   Colors.bgPrimary,
  },
  headerTitle: {
    fontSize:   FontSize['2xl'],
    fontWeight: '800',
    color:      Colors.navy,
  },
  headerBtn: {
    width:           40,
    height:          40,
    borderRadius:    Radius.sm,
    backgroundColor: Colors.teal,
    alignItems:      'center',
    justifyContent:  'center',
    ...Shadow.teal,
  },

  // ── Mode Banner ──
  modeBanner: {
    alignSelf:         'center',
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   Colors.teal,
    borderRadius:      Radius.full,
    paddingVertical:   7,
    paddingHorizontal: Spacing.lg,
    marginBottom:      Spacing.sm,
    ...Shadow.teal,
  },
  modeDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: '#6EE7B7',
    marginRight:     Spacing.sm,
  },
  modeBannerText: {
    color:      '#fff',
    fontSize:   FontSize.sm,
    fontWeight: '700',
  },

  // ── Search ──
  searchWrap: {
    marginHorizontal: Spacing.lg,
    marginBottom:     Spacing.sm,
  },
  searchBar: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   Colors.bgWhite,
    borderRadius:      Radius.md,
    paddingVertical:   11,
    paddingHorizontal: Spacing.md,
    borderWidth:       1.5,
    borderColor:       Colors.tealLight,
    ...Shadow.sm,
  },
  searchInput: {
    flex:       1,
    fontSize:   FontSize.md,
    color:      Colors.navy,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },

  // ── Route Pills ──
  pillsRow: {
    flexDirection:     'row',
    paddingHorizontal: Spacing.lg,
    marginBottom:      Spacing.sm,
    flexWrap:          'wrap',
    gap:               Spacing.sm,
  },
  pill: {
    flexDirection:     'row',
    alignItems:        'center',
    borderRadius:      Radius.full,
    paddingVertical:   6,
    paddingHorizontal: 12,
    gap:               6,
  },
  pillDot: {
    width:        10,
    height:       10,
    borderRadius: 5,
  },
  pillText: {
    fontSize:   FontSize.sm,
    fontWeight: '700',
  },

  // ── AI Loading ──
  aiLoadingWrap: {
    marginHorizontal: Spacing.lg,
    marginBottom:     Spacing.sm,
    backgroundColor:  Colors.tealLight,
    borderRadius:     Radius.md,
    padding:          Spacing.md,
    flexDirection:    'row',
    alignItems:       'center',
    gap:              Spacing.sm,
  },
  aiLoadingText: {
    fontSize:   FontSize.sm,
    color:      Colors.tealDark,
    fontWeight: '600',
    flex:       1,
  },

  // ── Map ──
  mapWrap: {
    flex:             1,
    marginHorizontal: Spacing.lg,
    marginBottom:     Spacing.sm,
    borderRadius:     Radius.xl,
    overflow:         'hidden',
    minHeight:        400,
    ...Shadow.lg,
  },
  map: { flex: 1 },

  // ── Map Overlays ──
  mapBadge: {
    position:          'absolute',
    top:               12,
    left:              12,
    backgroundColor:   'rgba(255,255,255,0.95)',
    borderRadius:      Radius.sm,
    paddingVertical:   6,
    paddingHorizontal: 10,
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    ...Shadow.sm,
  },
  mapBadgeText: {
    fontSize:   11,
    color:      Colors.slate,
    fontWeight: '600',
  },
  mapBadgeBold: {
    color:      Colors.navy,
    fontWeight: '800',
  },
  locateBtn: {
    position:        'absolute',
    bottom:          12,
    right:           12,
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: Colors.bgWhite,
    alignItems:      'center',
    justifyContent:  'center',
    ...Shadow.md,
  },
  pinchHint: {
    position:          'absolute',
    bottom:            12,
    left:              12,
    backgroundColor:   'rgba(255,255,255,0.9)',
    borderRadius:      Radius.sm,
    paddingVertical:   5,
    paddingHorizontal: 10,
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
  },
  pinchHintText: {
    fontSize: 11,
    color:    Colors.slate,
  },

  // ── Disclaimer ──
  disclaimer: {
    textAlign:         'center',
    fontSize:          11,
    color:             Colors.slate,
    paddingHorizontal: Spacing.lg,
    paddingBottom:     Spacing.sm,
    lineHeight:        16,
  },
});